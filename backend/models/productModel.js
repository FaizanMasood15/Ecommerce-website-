import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // References which admin added the product
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        sku: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            }
        ],
        colors: [
            {
                name: { type: String, required: true },
                hex: { type: String, required: true },
            }
        ],
        sizes: [
            {
                type: String,
            }
        ],
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
