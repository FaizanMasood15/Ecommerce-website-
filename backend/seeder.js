import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';
import users from './data/users.js';

// Convert frontend string prices (e.g., '2.500.000') to numbers for the backend DB
const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/\./g, ''));
};

const mockProducts = [
    { name: 'Syltherine', description: 'Stylish cafe chair', price: parsePrice('2.500.000'), category: 'Chairs', image: '/images/Images1.png', countInStock: 10 },
    { name: 'Leviosa', description: 'Stylish cafe chair', price: parsePrice('2.500.000'), category: 'Chairs', image: '/images/Images2.png', countInStock: 5 },
    { name: 'Lolito', description: 'Luxury big sofa', price: parsePrice('7.000.000'), category: 'Sofas', image: '/images/Images 3.png', countInStock: 2 },
    { name: 'Respira', description: 'Outdoor bar table and stool', price: parsePrice('500.000'), category: 'Outdoor', image: '/images/Images4.png', countInStock: 20 },
    { name: 'Grifo', description: 'Night lamp', price: parsePrice('1.500.000'), category: 'Lamps', image: '/images/Images5.png', countInStock: 15 },
    { name: 'Muggo', description: 'Small mug', price: parsePrice('150.000'), category: 'Accessories', image: '/images/Images6.png', countInStock: 50 },
    { name: 'Pingky', description: 'Cute bed set', price: parsePrice('7.000.000'), category: 'Beds', image: '/images/Images7.png', countInStock: 3 },
    { name: 'Potty', description: 'Minimalist flower pot', price: parsePrice('500.000'), category: 'Accessories', image: '/images/Images8.png', countInStock: 30 }
];

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = [];
        for (const user of users) {
            const createdUser = await User.create(user);
            createdUsers.push(createdUser);
        }
        const adminUser = createdUsers[0]._id; // First user is the admin

        const sampleProducts = mockProducts.map((product) => {
            const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return { ...product, slug, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
