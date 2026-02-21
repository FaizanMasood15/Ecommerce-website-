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

// @desc    Delete a product
// @route   DELETE /api/products/:idOrSlug
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const { id: idOrSlug } = req.params;
    let product;

    product = await Product.findOne({ slug: idOrSlug });

    if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(idOrSlug);
    }

    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: 'Sample name',
            slug: `sample-name-${Date.now()}`,
            sku: '',
            price: 0,
            user: req.user._id,
            image: '/images/sample.jpg',
            images: [],
            colors: [],
            sizes: [],
            category: 'Sample category',
            countInStock: 0,
            description: 'Sample description',
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:idOrSlug
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, sku, price, description, image, images, colors, sizes, category, countInStock, isNewProduct, discount } = req.body;
        const { id: idOrSlug } = req.params;
        let product;

        product = await Product.findOne({ slug: idOrSlug });

        if (!product && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(idOrSlug);
        }

        if (product) {
            product.name = name;
            product.sku = sku || '';
            product.price = price;
            product.description = description;
            product.image = image;
            product.images = images || [];
            product.colors = colors || [];
            product.sizes = sizes || [];
            product.category = category;
            product.countInStock = countInStock;
            let newSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            // Check if this slug is already taken by another product
            const existingSlugProduct = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
            if (existingSlugProduct) {
                newSlug = `${newSlug}-${Date.now()}`;
            }
            product.slug = newSlug;
            // Optional properties you might have added
            if (isNewProduct !== undefined) product.isNew = isNewProduct;
            if (discount !== undefined) product.discount = discount;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct };
