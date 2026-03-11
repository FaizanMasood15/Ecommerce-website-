import jwt from 'jsonwebtoken';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import {
    computeDiscountAmount,
    consumeCouponUsage,
    findCouponForCheckout,
    normalizeEmail,
    validateCouponEligibility,
} from '../utils/couponRules.js';

const VALID_PAYMENT_METHODS = ['COD', 'BankTransfer', 'EasyPaisa'];

const buildGuestAccessToken = (order) => jwt.sign(
    {
        type: 'guest-order-access',
        orderId: order._id.toString(),
        guestEmail: order.guestEmail,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
);

const calculateShipping = (itemsPrice) => (itemsPrice > 5000 ? 0 : 250);

const validateShippingAddress = (shippingAddress = {}) => {
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const missingField = requiredFields.find((field) => !String(shippingAddress[field] || '').trim());
    if (missingField) {
        throw new Error(`Shipping field is required: ${missingField}`);
    }
};

const resolveOrderItems = async (orderItems = []) => {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new Error('No order items');
    }

    const resolvedItems = [];
    for (const rawItem of orderItems) {
        const qty = Number(rawItem.qty);
        if (!Number.isFinite(qty) || qty <= 0) {
            throw new Error('Invalid quantity in order items');
        }

        const product = await Product.findById(rawItem.product);
        if (!product || product.isDraft) {
            throw new Error('One or more products are unavailable');
        }

        let variant = null;
        if (rawItem.variantId) {
            variant = product.variants.id(rawItem.variantId);
            if (!variant) {
                throw new Error(`Variant not found for product: ${product.name}`);
            }
        }

        const basePrice = variant && Number(variant.price) > 0 ? Number(variant.price) : Number(product.price);
        const image = (product.images && product.images.length > 0) ? product.images[0] : product.image;

        resolvedItems.push({
            name: product.name,
            qty,
            image,
            price: basePrice,
            selectedSize: rawItem.selectedSize || variant?.size || '',
            selectedColor: rawItem.selectedColor || variant?.color || '',
            selectedColorHex: rawItem.selectedColorHex || variant?.colorHex || '',
            variantSku: rawItem.variantSku || variant?.sku || '',
            product: product._id,
            variantId: variant?._id || null,
        });
    }

    return resolvedItems;
};

const reserveStock = async (orderItems) => {
    const reservations = [];

    try {
        for (const item of orderItems) {
            if (item.variantId) {
                const result = await Product.updateOne(
                    {
                        _id: item.product,
                        countInStock: { $gte: item.qty },
                        variants: { $elemMatch: { _id: item.variantId, countInStock: { $gte: item.qty } } },
                    },
                    {
                        $inc: {
                            countInStock: -item.qty,
                            'variants.$[v].countInStock': -item.qty,
                        },
                    },
                    {
                        arrayFilters: [{ 'v._id': item.variantId }],
                    }
                );

                if (!result.modifiedCount) {
                    throw new Error(`Insufficient stock for item: ${item.name}`);
                }

                reservations.push({ product: item.product, qty: item.qty, variantId: item.variantId });
            } else {
                const result = await Product.updateOne(
                    {
                        _id: item.product,
                        countInStock: { $gte: item.qty },
                    },
                    {
                        $inc: { countInStock: -item.qty },
                    }
                );

                if (!result.modifiedCount) {
                    throw new Error(`Insufficient stock for item: ${item.name}`);
                }

                reservations.push({ product: item.product, qty: item.qty, variantId: null });
            }
        }

        return reservations;
    } catch (error) {
        // Roll back any successful reservations if later reservation fails.
        for (const reservation of reservations) {
            if (reservation.variantId) {
                await Product.updateOne(
                    { _id: reservation.product },
                    {
                        $inc: {
                            countInStock: reservation.qty,
                            'variants.$[v].countInStock': reservation.qty,
                        },
                    },
                    { arrayFilters: [{ 'v._id': reservation.variantId }] }
                );
            } else {
                await Product.updateOne(
                    { _id: reservation.product },
                    { $inc: { countInStock: reservation.qty } }
                );
            }
        }

        throw error;
    }
};

const restoreStock = async (orderItems) => {
    for (const item of orderItems) {
        if (item.variantId) {
            await Product.updateOne(
                { _id: item.product },
                {
                    $inc: {
                        countInStock: item.qty,
                        'variants.$[v].countInStock': item.qty,
                    },
                },
                { arrayFilters: [{ 'v._id': item.variantId }] }
            );
        } else {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { countInStock: item.qty } }
            );
        }
    }
};

const resolveCouponForOrder = async ({ couponCode, itemsPrice, user, guestEmail, deviceId, clientOrderRef }) => {
    const normalizedCouponCode = String(couponCode || '').toUpperCase().trim();
    if (!normalizedCouponCode) {
        return { coupon: null, couponCode: '', discountAmount: 0 };
    }

    if (!clientOrderRef) {
        throw new Error('Order reference is required when applying a coupon');
    }

    const coupon = await findCouponForCheckout(normalizedCouponCode);
    const email = normalizeEmail(user?.email || guestEmail);
    const normalizedDeviceId = String(deviceId || '').trim();
    const normalizedOrderRef = String(clientOrderRef || '').trim();

    const validationError = validateCouponEligibility({
        coupon,
        orderTotal: itemsPrice,
        userId: user?._id || null,
        email,
        deviceId: normalizedDeviceId,
        clientOrderRef: normalizedOrderRef,
    });

    if (validationError) {
        throw new Error(validationError);
    }

    const discountAmount = computeDiscountAmount(coupon, itemsPrice);

    return {
        coupon,
        couponCode: coupon.code,
        discountAmount,
        email,
        deviceId: normalizedDeviceId,
        clientOrderRef: normalizedOrderRef,
    };
};

const createOrderInternal = async ({ req, res, isGuest }) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        couponCode,
        notes,
        guestEmail = '',
        deviceId = '',
        clientOrderRef = '',
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    if (isGuest && !/\S+@\S+\.\S+/.test(String(guestEmail || ''))) {
        return res.status(400).json({ message: 'A valid email is required for guest checkout' });
    }

    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
        return res.status(400).json({ message: 'Invalid payment method' });
    }

    try {
        validateShippingAddress(shippingAddress);

        const normalizedItems = await resolveOrderItems(orderItems);
        const itemsPrice = Math.round(normalizedItems.reduce((sum, item) => sum + (item.price * item.qty), 0));
        const shippingPrice = calculateShipping(itemsPrice);
        const taxPrice = 0;

        const couponInfo = await resolveCouponForOrder({
            couponCode,
            itemsPrice,
            user: req.user,
            guestEmail,
            deviceId,
            clientOrderRef,
        });

        const totalPrice = Math.max(0, itemsPrice + shippingPrice + taxPrice - couponInfo.discountAmount);

        await reserveStock(normalizedItems);

        const order = new Order({
            user: isGuest ? null : req.user._id,
            guestEmail: isGuest ? normalizeEmail(guestEmail) : '',
            deviceId: String(deviceId || '').trim(),
            clientOrderRef: String(clientOrderRef || '').trim(),
            orderItems: normalizedItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountAmount: couponInfo.discountAmount,
            couponCode: couponInfo.couponCode,
            totalPrice,
            notes: notes || '',
            status: 'Pending',
            statusHistory: [{ status: 'Pending', note: isGuest ? 'Guest order placed successfully.' : 'Order placed successfully.' }],
        });

        let createdOrder;
        try {
            createdOrder = await order.save();
        } catch (saveError) {
            await restoreStock(normalizedItems);
            throw saveError;
        }

        if (couponInfo.coupon) {
            try {
                await consumeCouponUsage({
                    coupon: couponInfo.coupon,
                    userId: req.user?._id || null,
                    email: couponInfo.email,
                    deviceId: couponInfo.deviceId,
                    clientOrderRef: couponInfo.clientOrderRef,
                });
            } catch (couponError) {
                await Order.deleteOne({ _id: createdOrder._id });
                await restoreStock(normalizedItems);
                throw couponError;
            }
        }

        if (!isGuest) {
            return res.status(201).json(createdOrder);
        }

        const guestAccessToken = buildGuestAccessToken(createdOrder);
        return res.status(201).json({
            order: createdOrder,
            guestAccessToken,
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Unable to create order' });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => createOrderInternal({ req, res, isGuest: false });

// @desc    Create guest order (no account needed)
// @route   POST /api/orders/guest
// @access  Public
const createGuestOrder = async (req, res) => createOrderInternal({ req, res, isGuest: true });

// @desc    Get guest order by ID with access token
// @route   GET /api/orders/guest/:id
// @access  Public
const getGuestOrderById = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(401).json({ message: 'Guest access token is required' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.user) {
            return res.status(403).json({ message: 'Not a guest order' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (
            decoded?.type !== 'guest-order-access' ||
            decoded?.orderId !== order._id.toString() ||
            decoded?.guestEmail !== order.guestEmail
        ) {
            return res.status(403).json({ message: 'Invalid guest access token' });
        }

        return res.json(order);
    } catch {
        return res.status(403).json({ message: 'Guest link is invalid or expired' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!req.user.isAdmin && (!order.user || order.user._id.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorised to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
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

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
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

        if (status === 'Cancelled' && order.status !== 'Cancelled') {
            await restoreStock(order.orderItems);
            order.isCancelled = true;
            order.cancelledAt = Date.now();
        }

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

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
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

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
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

// @desc    Get admin analytics summary
// @route   GET /api/orders/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        const allOrdersCount = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const processingOrders = await Order.countDocuments({ status: { $in: ['Processing', 'Packed', 'Shipped', 'Out for Delivery'] } });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        const revenueResult = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
        ]);
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        const period = req.query.period || 'monthly';
        const now = new Date();
        let chartData = [];

        if (period === 'daily') {
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
            const raw = await Order.aggregate([
                { $match: { status: 'Delivered', createdAt: { $gte: start } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, day: { $dayOfMonth: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
            ]);
            const map = {};
            raw.forEach((r) => { map[`${r._id.year}-${r._id.month}-${r._id.day}`] = r; });
            for (let i = 29; i >= 0; i -= 1) {
                const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
                const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
                chartData.push(map[key] || { _id: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }, revenue: 0, orders: 0 });
            }
        } else if (period === 'weekly') {
            const dayOfWeek = now.getDay();
            const daysSinceMonday = (dayOfWeek + 6) % 7;
            const thisMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday);
            const start = new Date(thisMonday.getTime() - 11 * 7 * 24 * 60 * 60 * 1000);
            const raw = await Order.aggregate([
                { $match: { status: 'Delivered', createdAt: { $gte: start } } },
                { $group: { _id: { year: { $isoWeekYear: '$createdAt' }, week: { $isoWeek: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.week': 1 } },
            ]);
            const map = {};
            raw.forEach((r) => { map[`${r._id.year}-${r._id.week}`] = r; });
            for (let i = 11; i >= 0; i -= 1) {
                const weekStart = new Date(thisMonday.getTime() - i * 7 * 24 * 60 * 60 * 1000);
                const tmp = new Date(Date.UTC(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()));
                tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
                const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
                const isoWeek = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
                const isoYear = tmp.getUTCFullYear();
                const key = `${isoYear}-${isoWeek}`;
                const dayLabel = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
                const entry = map[key]
                    ? { ...map[key], _id: { ...map[key]._id, weekLabel: dayLabel } }
                    : { _id: { year: isoYear, week: isoWeek, weekLabel: dayLabel }, revenue: 0, orders: 0 };
                chartData.push(entry);
            }
        } else if (period === 'yearly') {
            const startYear = now.getFullYear() - 9;
            const raw = await Order.aggregate([
                { $match: { status: 'Delivered', createdAt: { $gte: new Date(`${startYear}-01-01`) } } },
                { $group: { _id: { year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
                { $sort: { '_id.year': 1 } },
            ]);
            const map = {};
            raw.forEach((r) => { map[`${r._id.year}`] = r; });
            for (let y = startYear; y <= now.getFullYear(); y += 1) {
                chartData.push(map[`${y}`] || { _id: { year: y }, revenue: 0, orders: 0 });
            }
        } else {
            const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
            const raw = await Order.aggregate([
                { $match: { status: 'Delivered', createdAt: { $gte: twelveMonthsAgo } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, orders: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]);
            const map = {};
            raw.forEach((r) => { map[`${r._id.year}-${r._id.month}`] = r; });
            for (let i = 11; i >= 0; i -= 1) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;
                chartData.push(map[`${year}-${month}`] || { _id: { year, month }, revenue: 0, orders: 0 });
            }
        }

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
            chartData,
            period,
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
