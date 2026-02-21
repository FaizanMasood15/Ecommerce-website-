import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Fetch single product by slug or ID
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductById = async (req, res) => {
    const { id: idOrSlug } = req.params;
    let product;

    // First try to find by exact slug match
    product = await Product.findOne({ slug: idOrSlug });

    // If no slug match and it's a valid Mongo ObjectId, try ID lookup
    if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(idOrSlug);
    }

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

export { getProducts, getProductById };
