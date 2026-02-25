// src/pages/OrderHistoryPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { Loader, ShoppingBag, Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Processing: 'bg-blue-100 text-blue-700',
        Packed: 'bg-purple-100 text-purple-700',
        Shipped: 'bg-indigo-100 text-indigo-700',
        'Out for Delivery': 'bg-orange-100 text-orange-700',
        Delivered: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
        Refunded: 'bg-gray-100 text-gray-600',
    };
    return (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

const OrderHistoryPage = () => {
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-amber-700" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-4xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-500 mb-8">Track and manage your orders</p>

                {error && (
                    <p className="text-red-500">Failed to load orders. Please try again.</p>
                )}

                {!isLoading && !error && (!orders || orders.length === 0) && (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to place your first order!</p>
                        <Link
                            to="/shop"
                            className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                )}

                {orders && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-mono font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-bold text-gray-900">Rs. {order.totalPrice?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Items</p>
                                        <p className="text-gray-800">{order.orderItems?.length}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={order.status} />
                                        <Link
                                            to={`/orders/${order._id}`}
                                            className="flex items-center gap-1 text-amber-700 font-medium hover:text-amber-800 text-sm"
                                        >
                                            <Eye className="w-4 h-4" /> View
                                        </Link>
                                    </div>
                                </div>

                                {/* Item preview thumbnails */}
                                <div className="flex gap-2 mt-4">
                                    {order.orderItems.slice(0, 4).map((item, i) => (
                                        <img
                                            key={i}
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                            title={item.name}
                                        />
                                    ))}
                                    {order.orderItems.length > 4 && (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            +{order.orderItems.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
