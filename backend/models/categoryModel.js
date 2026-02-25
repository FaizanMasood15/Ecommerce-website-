// backend/models/categoryModel.js
import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        icon: {
            // Emoji or lucide icon name for display in nav
            type: String,
            default: '',
        },
        parent: {
            // null = top-level category; ObjectId = subcategory
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        order: {
            // Controls display order in nav (lower = first)
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        showInNav: {
            // Can toggle individual categories off the nav
            type: Boolean,
            default: true,
        },
        featuredProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
    },
    { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
