// backend/controllers/reviewController.js
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import mongoose from 'mongoose';

// Helper: recalculate product average rating
const updateProductRating = async (productId) => {
    const stats = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            numReviews: stats[0].numReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Review.countDocuments({ product: productId }),
    ]);

    // Rating distribution
    const distribution = await Review.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: -1 } },
    ]);

    res.json({
        reviews,
        page,
        pages: Math.ceil(total / limit),
        total,
        distribution: distribution.reduce((acc, d) => { acc[d._id] = d.count; return acc; }, {}),
    });
};

// @desc    Create a review
// @route   POST /api/reviews/product/:productId
// @access  Private
const createReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check not already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    // Check if verified purchase
    const order = await Order.findOne({
        user: req.user._id,
        'orderItems.product': productId,
        isDelivered: true,
    });

    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating: Number(rating),
        title,
        comment,
        isVerifiedPurchase: !!order,
    });

    await updateProductRating(productId);

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
};

// @desc    Delete a review (admin or owner)
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);

    res.json({ message: 'Review deleted' });
};

export { getProductReviews, createReview, deleteReview };
