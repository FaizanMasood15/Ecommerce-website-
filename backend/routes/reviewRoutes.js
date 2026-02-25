// backend/routes/reviewRoutes.js
import express from 'express';
import {
    getProductReviews,
    createReview,
    deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/product/:productId')
    .get(getProductReviews)
    .post(protect, createReview);

router.route('/:reviewId')
    .delete(protect, deleteReview);

export default router;
