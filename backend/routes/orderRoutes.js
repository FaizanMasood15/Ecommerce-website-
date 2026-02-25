import express from 'express';
import {
    createOrder,
    createGuestOrder,
    getOrderById,
    getGuestOrderById,
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

// ── Guest checkout routes (PUBLIC — no auth) ──────────────────────────────
router.post('/guest', createGuestOrder);
router.get('/guest/:id', getGuestOrderById);

// Create order / Get all orders (admin)
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

// Single order by ID (authenticated users / admin)
router.route('/:id')
    .get(protect, getOrderById);

// Update status (admin)
router.put('/:id/status', protect, admin, updateOrderStatus);

// Mark paid / Mark delivered (admin)
router.put('/:id/pay', protect, admin, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;
