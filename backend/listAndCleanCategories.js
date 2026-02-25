// listAndCleanCategories.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const col = mongoose.connection.db.collection('categories');
    const all = await col.find({}).sort({ name: 1 }).toArray();
    console.log(`\n=== All Categories (${all.length}) ===`);
    all.forEach(c => {
        const parentStr = c.parent ? ` [child of ${c.parent}]` : ' [top-level]';
        console.log(`  ${c._id}  "${c.name}"  slug="${c.slug}"${parentStr}  active=${c.isActive}  showInNav=${c.showInNav}`);
    });

    // Delete any whose slug is not one of the known seeded categories
    const validSlugs = [
        'furniture', 'bedroom', 'decor', 'outdoor', 'kitchen',
        'sofas', 'chairs', 'dining-tables', 'bookshelves',
        'beds-frames', 'wardrobes', 'dressers',
        'lighting', 'rugs-carpets', 'wall-art',
    ];
    const toDelete = all.filter(c => !validSlugs.includes(c.slug));
    if (toDelete.length > 0) {
        const ids = toDelete.map(c => c._id);
        const result = await col.deleteMany({ _id: { $in: ids } });
        console.log(`\n🗑️  Removed ${result.deletedCount} stray categories:`);
        toDelete.forEach(c => console.log(`   - "${c.name}" (${c.slug})`));
    } else {
        console.log('\n✅ No stray categories found.');
    }

    await mongoose.disconnect();
    process.exit(0);
};

run().catch(err => { console.error(err.message); process.exit(1); });
