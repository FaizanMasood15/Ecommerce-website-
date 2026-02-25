// seedCoupon.js — creates a test coupon in the database
// Usage: node seedCoupon.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // Remove existing test coupon if any
    await db.collection('coupons').deleteOne({ code: 'SAVE20' });
    await db.collection('coupons').deleteOne({ code: 'FLAT500' });

    await db.collection('coupons').insertMany([
        {
            code: 'SAVE20',
            description: '20% off your order!',
            discountType: 'percentage',
            discountValue: 20,
            minOrderAmount: 1000,
            maxUses: null,
            usedCount: 0,
            usedBy: [],
            expiresAt: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            code: 'FLAT500',
            description: 'Rs. 500 flat discount',
            discountType: 'fixed',
            discountValue: 500,
            minOrderAmount: 2000,
            maxUses: 100,
            usedCount: 0,
            usedBy: [],
            expiresAt: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ]);

    console.log('✅ Test coupons created!');
    console.log('  • SAVE20 — 20% off (min Rs. 1,000)');
    console.log('  • FLAT500 — Rs. 500 off (min Rs. 2,000)');

    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => {
    console.error(err.message);
    process.exit(1);
});
