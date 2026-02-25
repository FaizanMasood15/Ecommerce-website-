// backend/controllers/wishlistController.js
import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate('products.product', 'name price image images slug');

    if (!wishlist) {
        wishlist = { products: [] };
    }

    res.json(wishlist);
};

// @desc    Add product to wishlist (toggle)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const existingIndex = wishlist.products.findIndex(
        (p) => p.product.toString() === productId
    );

    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.products.splice(existingIndex, 1);
        await wishlist.save();
        res.json({ message: 'Removed from wishlist', inWishlist: false });
    } else {
        // Add to wishlist
        wishlist.products.push({ product: productId });
        await wishlist.save();
        res.json({ message: 'Added to wishlist', inWishlist: true });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.products = wishlist.products.filter(
        (p) => p.product.toString() !== productId
    );

    await wishlist.save();
    res.json({ message: 'Removed from wishlist' });
};

export { getWishlist, toggleWishlist, removeFromWishlist };
