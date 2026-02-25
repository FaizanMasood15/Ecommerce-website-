// backend/models/wishlistModel.js
import mongoose from 'mongoose';

const wishlistSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One wishlist per user
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
