// seedCategories.js — seeds sample nav categories into the database
// Usage: node seedCategories.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const col = db.collection('categories');

    // Clear existing
    await col.deleteMany({});

    const now = new Date();

    // Insert top-level categories first
    const topResult = await col.insertMany([
        { name: 'Furniture', slug: 'furniture', icon: '🛋️', description: 'Sofas, chairs & tables', order: 0, isActive: true, showInNav: true, parent: null, createdAt: now, updatedAt: now },
        { name: 'Bedroom', slug: 'bedroom', icon: '🛏️', description: 'Beds, wardrobes & more', order: 1, isActive: true, showInNav: true, parent: null, createdAt: now, updatedAt: now },
        { name: 'Decor', slug: 'decor', icon: '🪴', description: 'Lighting, art & accessories', order: 2, isActive: true, showInNav: true, parent: null, createdAt: now, updatedAt: now },
        { name: 'Outdoor', slug: 'outdoor', icon: '⛱️', description: 'Garden & patio furniture', order: 3, isActive: true, showInNav: true, parent: null, createdAt: now, updatedAt: now },
    ]);

    const ids = Object.values(topResult.insertedIds);
    const [furnitureId, bedroomId, decorId] = ids;

    // Insert subcategories
    await col.insertMany([
        // Furniture subcats
        { name: 'Sofas', slug: 'sofas', icon: '🛋️', order: 0, isActive: true, showInNav: true, parent: furnitureId, createdAt: now, updatedAt: now },
        { name: 'Chairs', slug: 'chairs', icon: '🪑', order: 1, isActive: true, showInNav: true, parent: furnitureId, createdAt: now, updatedAt: now },
        { name: 'Dining Tables', slug: 'dining-tables', icon: '🍽️', order: 2, isActive: true, showInNav: true, parent: furnitureId, createdAt: now, updatedAt: now },
        { name: 'Bookshelves', slug: 'bookshelves', icon: '📚', order: 3, isActive: true, showInNav: true, parent: furnitureId, createdAt: now, updatedAt: now },
        // Bedroom subcats
        { name: 'Beds & Frames', slug: 'beds-frames', icon: '🛏️', order: 0, isActive: true, showInNav: true, parent: bedroomId, createdAt: now, updatedAt: now },
        { name: 'Wardrobes', slug: 'wardrobes', icon: '🚪', order: 1, isActive: true, showInNav: true, parent: bedroomId, createdAt: now, updatedAt: now },
        { name: 'Dressers', slug: 'dressers', icon: '🪞', order: 2, isActive: true, showInNav: true, parent: bedroomId, createdAt: now, updatedAt: now },
        // Decor subcats
        { name: 'Lighting', slug: 'lighting', icon: '💡', order: 0, isActive: true, showInNav: true, parent: decorId, createdAt: now, updatedAt: now },
        { name: 'Rugs & Carpets', slug: 'rugs-carpets', icon: '🟫', order: 1, isActive: true, showInNav: true, parent: decorId, createdAt: now, updatedAt: now },
        { name: 'Wall Art', slug: 'wall-art', icon: '🖼️', order: 2, isActive: true, showInNav: true, parent: decorId, createdAt: now, updatedAt: now },
    ]);

    console.log('✅ Nav categories seeded!');
    console.log('  Top-level: Furniture, Bedroom, Decor, Outdoor');
    console.log('  Subcategories: 10 subcategories across 3 parents');
    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => { console.error(err.message); process.exit(1); });
