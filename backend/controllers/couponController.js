// backend/controllers/couponController.js
import Coupon from '../models/couponModel.js';

// @desc    Validate and apply a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    const { code, orderTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) return res.status(404).json({ message: 'Coupon code not found' });
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({ message: 'This coupon has expired' });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }
    if (orderTotal < coupon.minOrderAmount) {
        return res.status(400).json({
            message: `Minimum order amount is Rs. ${coupon.minOrderAmount.toLocaleString()}`,
        });
    }
    if (coupon.usedBy.includes(req.user._id)) {
        return res.status(400).json({ message: 'You have already used this coupon' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = (orderTotal * coupon.discountValue) / 100;
    } else {
        discountAmount = coupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, orderTotal); // Can't discount more than order total

    res.json({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discountAmount),
        finalTotal: Math.round(orderTotal - discountAmount),
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
    const { code, description, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxUses: maxUses || null,
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
