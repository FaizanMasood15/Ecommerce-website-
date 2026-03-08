// backend/controllers/couponController.js
import Coupon from '../models/couponModel.js';
import {
    computeDiscountAmount,
    findCouponForCheckout,
    normalizeEmail,
    validateCouponEligibility,
} from '../utils/couponRules.js';

// @desc    Validate and apply a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    const {
        code,
        orderTotal = 0,
        guestEmail = '',
        deviceId = '',
        clientOrderRef = '',
    } = req.body;
    const coupon = await findCouponForCheckout(code);

    const validationError = validateCouponEligibility({
        coupon,
        orderTotal: Number(orderTotal) || 0,
        userId: req.user?._id || null,
        email: normalizeEmail(req.user?.email || guestEmail),
        deviceId: String(deviceId || '').trim(),
        clientOrderRef: String(clientOrderRef || '').trim(),
    });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const discountAmount = computeDiscountAmount(coupon, Number(orderTotal) || 0);

    res.json({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalTotal: Math.max(0, Math.round((Number(orderTotal) || 0) - discountAmount)),
    });
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    const {
        code,
        description,
        discountType,
        discountValue,
        minOrderAmount,
        maxUses,
        maxUsesPerEmail,
        maxUsesPerDevice,
        expiresAt,
    } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxUses: maxUses || null,
        maxUsesPerEmail: maxUsesPerEmail ?? 1,
        maxUsesPerDevice: maxUsesPerDevice ?? 1,
        expiresAt: expiresAt || null,
    });

    res.status(201).json(coupon);
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    Object.assign(coupon, req.body);
    if (req.body.code) coupon.code = req.body.code.toUpperCase();
    const updated = await coupon.save();
    res.json(updated);
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.deleteOne();
    res.json({ message: 'Coupon deleted' });
};

export { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
