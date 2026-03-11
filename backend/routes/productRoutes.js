import express from 'express';
import { getProducts, getProductById, deleteProduct, createProduct, updateProduct } from '../controllers/productController.js';
import { optionalProtect, protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Explicit admin read routes for drafts/all products
router.get('/admin/list', protect, admin, (req, res, next) => {
    req.includeDrafts = true;
    next();
}, getProducts);
router.get('/admin/:id', protect, admin, (req, res, next) => {
    req.includeDrafts = true;
    next();
}, getProductById);

router.route('/').get(optionalProtect, getProducts).post(protect, admin, createProduct);
router.route('/:id').get(optionalProtect, getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);

export default router;
