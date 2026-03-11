// backend/routes/couponRoutes.js
import express from 'express';
import {
    validateCoupon,
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} from '../controllers/couponController.js';
import { optionalProtect, protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', optionalProtect, validateCoupon);

router.route('/')
    .get(protect, admin, getAllCoupons)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

export default router;
