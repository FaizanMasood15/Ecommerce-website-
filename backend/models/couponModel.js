// backend/models/couponModel.js
import mongoose from 'mongoose';

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
            default: 'percentage',
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        maxUses: {
            type: Number,
            default: null, // null = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        usedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        usageByEmail: [
            {
                email: { type: String, required: true, lowercase: true, trim: true },
                count: { type: Number, default: 0 },
            },
        ],
        usageByDevice: [
            {
                deviceId: { type: String, required: true, trim: true },
                count: { type: Number, default: 0 },
            },
        ],
        usedOrderRefs: [
            {
                type: String,
                trim: true,
            },
        ],
        maxUsesPerEmail: {
            type: Number,
            default: 1,
        },
        maxUsesPerDevice: {
            type: Number,
            default: 1,
        },
        expiresAt: {
            type: Date,
            default: null, // null = never expires
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
