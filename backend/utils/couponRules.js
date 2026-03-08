import Coupon from '../models/couponModel.js';

const normalizeEmail = (email = '') => email.toLowerCase().trim();
const normalizeCode = (code = '') => code.toUpperCase().trim();

const computeDiscountAmount = (coupon, orderTotal) => {
    if (!coupon) return 0;
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (orderTotal * coupon.discountValue) / 100;
    } else {
        discountAmount = coupon.discountValue;
    }
    return Math.min(Math.round(discountAmount), Math.round(orderTotal));
};

const getEmailUsageCount = (coupon, email) => {
    if (!email) return 0;
    const found = coupon.usageByEmail.find((entry) => entry.email === email);
    return found?.count || 0;
};

const getDeviceUsageCount = (coupon, deviceId) => {
    if (!deviceId) return 0;
    const found = coupon.usageByDevice.find((entry) => entry.deviceId === deviceId);
    return found?.count || 0;
};

const validateCouponEligibility = ({ coupon, orderTotal, userId, email, deviceId, clientOrderRef }) => {
    if (!coupon) return 'Coupon code not found';
    if (!coupon.isActive) return 'This coupon is no longer active';
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return 'This coupon has expired';
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return 'This coupon has reached its usage limit';
    }
    if (orderTotal < coupon.minOrderAmount) {
        return `Minimum order amount is $${coupon.minOrderAmount.toLocaleString('en-US')}`;
    }

    if (userId && coupon.usedBy.some((id) => id.toString() === userId.toString())) {
        return 'You have already used this coupon';
    }

    if (email) {
        const emailCount = getEmailUsageCount(coupon, email);
        const maxPerEmail = coupon.maxUsesPerEmail ?? 1;
        if (maxPerEmail !== null && emailCount >= maxPerEmail) {
            return 'This coupon has reached its limit for this email';
        }
    }

    if (deviceId) {
        const deviceCount = getDeviceUsageCount(coupon, deviceId);
        const maxPerDevice = coupon.maxUsesPerDevice ?? 1;
        if (maxPerDevice !== null && deviceCount >= maxPerDevice) {
            return 'This coupon has reached its limit for this device';
        }
    }

    if (clientOrderRef && coupon.usedOrderRefs.includes(clientOrderRef)) {
        return 'This coupon has already been used for this order';
    }

    return null;
};

const findCouponForCheckout = async (code) => {
    const normalized = normalizeCode(code);
    if (!normalized) return null;
    return Coupon.findOne({ code: normalized });
};

const consumeCouponUsage = async ({ coupon, userId, email, deviceId, clientOrderRef }) => {
    if (!coupon) return;

    if (userId && !coupon.usedBy.some((id) => id.toString() === userId.toString())) {
        coupon.usedBy.push(userId);
    }

    if (email) {
        const existingEmail = coupon.usageByEmail.find((entry) => entry.email === email);
        if (existingEmail) existingEmail.count += 1;
        else coupon.usageByEmail.push({ email, count: 1 });
    }

    if (deviceId) {
        const existingDevice = coupon.usageByDevice.find((entry) => entry.deviceId === deviceId);
        if (existingDevice) existingDevice.count += 1;
        else coupon.usageByDevice.push({ deviceId, count: 1 });
    }

    if (clientOrderRef && !coupon.usedOrderRefs.includes(clientOrderRef)) {
        coupon.usedOrderRefs.push(clientOrderRef);
    }

    coupon.usedCount += 1;
    await coupon.save();
};

export {
    normalizeCode,
    normalizeEmail,
    computeDiscountAmount,
    validateCouponEligibility,
    findCouponForCheckout,
    consumeCouponUsage,
};
