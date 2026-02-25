import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,   // null for guest orders
            ref: 'User',
        },
        // Guest checkout support — email provided at checkout, no account needed
        guestEmail: {
            type: String,
            default: '',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                // Variant details (if applicable)
                selectedSize: { type: String, default: '' },
                selectedColor: { type: String, default: '' },
                selectedColorHex: { type: String, default: '' },
                variantSku: { type: String, default: '' },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                variantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: null,
                },
            }
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, default: '' },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'COD',
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discountAmount: {
            type: Number,
            default: 0.0,
        },
        couponCode: {
            type: String,
            default: '',
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        // Order status: simple string for current status
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'],
        },
        // Full status history log
        statusHistory: [
            {
                status: { type: String, required: true },
                note: { type: String, default: '' },
                changedAt: { type: Date, default: Date.now },
            }
        ],
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        cancelledAt: {
            type: Date,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
