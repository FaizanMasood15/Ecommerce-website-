// makeAdmin.js — promotes a user to admin directly via MongoDB
// Usage: node makeAdmin.js <email>

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const email = process.argv[2];
if (!email) {
    console.log('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await mongoose.connection.collection('users').updateOne(
        { email },
        { $set: { isAdmin: true } }
    );

    if (result.matchedCount === 0) {
        console.log(`❌ No user found with email: ${email}`);
    } else {
        console.log(`✅ ${email} is now an admin! (isAdmin=true)`);
    }

    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
