// backend/routes/categoryRoutes.js
import express from 'express';
import {
    getNavCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public — used by the nav bar
router.get('/nav', getNavCategories);

// Admin CRUD
router.put('/reorder', protect, admin, reorderCategories);
router.route('/')
    .get(protect, admin, getAllCategories)
    .post(protect, admin, createCategory);

router.route('/:id')
    .get(protect, admin, getCategoryById)
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

export default router;
