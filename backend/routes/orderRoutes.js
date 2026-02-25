import express from 'express';
import {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAnalytics,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin analytics — must be before /:id to avoid being caught by that param
router.get('/analytics', protect, admin, getAnalytics);

// My orders (logged-in user)
router.get('/myorders', protect, getMyOrders);

// Create order / Get all orders (admin)
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

// Single order by ID
router.route('/:id')
    .get(protect, getOrderById);

// Update status (admin)
router.put('/:id/status', protect, admin, updateOrderStatus);

// Mark paid / Mark delivered (admin)
router.put('/:id/pay', protect, admin, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;
