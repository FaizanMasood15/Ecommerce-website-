// clearCategoryIcons.js — removes emoji icons from all categories
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const col = mongoose.connection.db.collection('categories');
    const result = await col.updateMany({}, { $set: { icon: '' } });
    console.log(`✅ Cleared icons from ${result.modifiedCount} categories`);
    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => { console.error(err.message); process.exit(1); });
