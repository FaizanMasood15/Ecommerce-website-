// backend/controllers/categoryController.js
import Category from '../models/categoryModel.js';

// Helper: build slug from name
const makeSlug = (name) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// @desc    Get full nav tree (active + showInNav, nested)
// @route   GET /api/categories/nav
// @access  Public
const getNavCategories = async (req, res) => {
    try {
        const all = await Category.find({ isActive: true, showInNav: true })
            .sort({ order: 1, name: 1 })
            .lean();

        const topLevel = all.filter(c => !c.parent);
        const childMap = {};
        all.filter(c => c.parent).forEach(c => {
            const pid = c.parent.toString();
            if (!childMap[pid]) childMap[pid] = [];
            childMap[pid].push(c);
        });

        const tree = topLevel.map(cat => ({
            ...cat,
            subcategories: childMap[cat._id.toString()] || [],
        }));

        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories (admin)
// @route   GET /api/categories
// @access  Private/Admin
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate('parent', 'name')
            .sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent', 'name');
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, description, image, icon, parent, order, isActive, showInNav } = req.body;

        if (!name) return res.status(400).json({ message: 'Category name is required' });

        const slug = makeSlug(name);
        const exists = await Category.findOne({ slug });
        if (exists) return res.status(400).json({ message: `Category "${name}" already exists` });

        const category = await Category.create({
            name,
            slug,
            description: description || '',
            image: image || '',
            icon: icon || '',
            parent: parent || null,
            order: order !== undefined ? Number(order) : 0,
            isActive: isActive !== undefined ? Boolean(isActive) : true,
            showInNav: showInNav !== undefined ? Boolean(showInNav) : true,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        const { name, description, image, icon, parent, order, isActive, showInNav } = req.body;

        if (name && name !== category.name) {
            const newSlug = makeSlug(name);
            const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
            if (slugExists) return res.status(400).json({ message: `Name "${name}" is already taken` });
            category.slug = newSlug;
            category.name = name;
        }

        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (icon !== undefined) category.icon = icon;
        if (parent !== undefined) category.parent = parent || null;
        if (order !== undefined) category.order = Number(order);
        if (isActive !== undefined) category.isActive = Boolean(isActive);
        if (showInNav !== undefined) category.showInNav = Boolean(showInNav);

        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete category (children promoted to top-level)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await Category.updateMany({ parent: category._id }, { $set: { parent: null } });
        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder categories
// @route   PUT /api/categories/reorder
// @access  Private/Admin
const reorderCategories = async (req, res) => {
    try {
        const { items } = req.body;
        await Promise.all(
            items.map(({ id, order }) => Category.findByIdAndUpdate(id, { order: Number(order) }))
        );
        res.json({ message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getNavCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
};
