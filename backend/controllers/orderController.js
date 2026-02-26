import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// ─────────────────────────────────────────────
// Helper: deduct stock after order is placed
// ─────────────────────────────────────────────
const deductStock = async (orderItems) => {
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        // If the order item has a specific variant, deduct from that variant
        if (item.variantId) {
            const variant = product.variants.id(item.variantId);
            if (variant) {
                variant.countInStock = Math.max(0, variant.countInStock - item.qty);
            }
        }

        // Always deduct from main product stock too (keep in sync)
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        await product.save();
    }
};

// ─────────────────────────────────────────────
// Helper: restore stock on cancellation
// ─────────────────────────────────────────────
const restoreStock = async (orderItems) => {
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) continue;

        if (item.variantId) {
            const variant = product.variants.id(item.variantId);
            if (variant) {
                variant.countInStock += item.qty;
            }
        }
        product.countInStock += item.qty;
        await product.save();
    }
};

// ─────────────────────────────────────────────
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// ─────────────────────────────────────────────
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountAmount,
            couponCode,
            totalPrice,
            notes,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            itemsPrice,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0,
            discountAmount: discountAmount || 0,
            couponCode: couponCode || '',
            totalPrice,
            notes: notes || '',
            status: 'Pending',
            statusHistory: [{ status: 'Pending', note: 'Order placed successfully.' }],
        });

        const createdOrder = await order.save();
        await deductStock(orderItems);
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Create guest order (no account needed)
// @route   POST /api/orders/guest
// @access  Public
// ─────────────────────────────────────────────
const createGuestOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountAmount,
            couponCode,
            totalPrice,
            notes,
            guestEmail,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }
        if (!guestEmail || !/\S+@\S+\.\S+/.test(guestEmail)) {
            return res.status(400).json({ message: 'A valid email is required for guest checkout' });
        }

        const order = new Order({
            user: null,
            guestEmail: guestEmail.toLowerCase().trim(),
            orderItems,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            itemsPrice,
            taxPrice: taxPrice || 0,
            shippingPrice: shippingPrice || 0,
            discountAmount: discountAmount || 0,
            couponCode: couponCode || '',
            totalPrice,
            notes: notes || '',
            status: 'Pending',
            statusHistory: [{ status: 'Pending', note: 'Guest order placed successfully.' }],
        });

        const createdOrder = await order.save();
        await deductStock(orderItems);
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Get guest order by ID (public — no auth)
// @route   GET /api/orders/guest/:id
// @access  Public
// ─────────────────────────────────────────────
const getGuestOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Only expose if it actually is a guest order (no linked user)
        if (order.user) {
            return res.status(403).json({ message: 'Not a guest order' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ─────────────────────────────────────────────
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
// ─────────────────────────────────────────────
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow the owner or admin to view the order
        // order.user can be null for guest orders — admins can always view
        if (!req.user.isAdmin && (!order.user || order.user._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorised to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
// ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
// ─────────────────────────────────────────────
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const validStatuses = ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // If cancelling, restore stock
        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            await restoreStock(order.orderItems);
            order.isCancelled = true;
            order.cancelledAt = Date.now();
        }

        // If marking as Delivered
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        order.status = status;
        order.statusHistory.push({
            status,
            note: note || '',
            changedAt: new Date(),
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
// ─────────────────────────────────────────────
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        if (order.status === 'Pending') {
            order.status = 'Processing';
            order.statusHistory.push({
                status: 'Processing',
                note: 'Payment received.',
                changedAt: new Date(),
            });
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
// ─────────────────────────────────────────────
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
        order.statusHistory.push({
            status: 'Delivered',
            note: 'Order has been delivered.',
            changedAt: new Date(),
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────
// @desc    Get admin analytics summary
// @route   GET /api/orders/analytics
// @access  Private/Admin
// ─────────────────────────────────────────────
const getAnalytics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });
        const allOrdersCount = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const processingOrders = await Order.countDocuments({ status: { $in: ['Processing', 'Packed', 'Shipped', 'Out for Delivery'] } });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        // Total revenue: count all non-cancelled orders' total prices
        // (covers COD where isPaid may not be set until manual action)
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // Monthly revenue for the last 6 months — based on Delivered orders
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered',
                    createdAt: { $gte: sixMonthsAgo },
                }
            },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        // Recent 5 orders
        const recentOrders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders: allOrdersCount,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
            monthlyRevenue,
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
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
};
