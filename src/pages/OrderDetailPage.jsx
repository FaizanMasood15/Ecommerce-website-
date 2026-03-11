// src/pages/OrderDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import { Loader, AlertCircle, Package, CheckCircle, Truck, Clock } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Processing: 'bg-blue-100 text-blue-800',
        Packed: 'bg-purple-100 text-purple-800',
        Shipped: 'bg-indigo-100 text-indigo-800',
        'Out for Delivery': 'bg-orange-100 text-orange-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
        Refunded: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-amber-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-3xl px-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                <p className="text-gray-600">{error?.data?.message || 'Order not found.'}</p>
                <Link to="/profile/orders" className="mt-4 inline-block text-amber-700 hover:underline">← Back to Orders</Link>
            </div>
        );
    }

    const currentStep = STATUS_STEPS.indexOf(order.status);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link to="/profile/orders" className="text-amber-700 text-sm hover:underline">← My Orders</Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {/* Progress Tracker */}
                {order.status !== 'Cancelled' && order.status !== 'Refunded' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="font-bold text-gray-900 mb-4">Order Progress</h2>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute inset-y-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                            <div
                                className="absolute inset-y-1/2 left-0 h-1 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-700"
                                style={{ width: currentStep >= 0 ? `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
                            />
                            {STATUS_STEPS.map((step, index) => (
                                <div key={step} className="flex flex-col items-center z-10">
                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${index <= currentStep ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {index < currentStep ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-1.5 text-center max-w-[60px] ${index <= currentStep ? 'text-amber-700 font-semibold' : 'text-gray-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Truck className="w-4 h-4 text-amber-700" /> Shipping To</h2>
                        <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                        {order.shippingAddress.phone && <p className="text-sm text-gray-600">📞 {order.shippingAddress.phone}</p>}
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Package className="w-4 h-4 text-amber-700" /> Payment</h2>
                        <p className="text-gray-600 text-sm">Method: <span className="font-medium text-gray-800">{order.paymentMethod}</span></p>
                        <p className="text-gray-600 text-sm mt-1">
                            Status: {order.isPaid
                                ? <span className="text-green-600 font-semibold">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                                : <span className="text-yellow-600 font-semibold">Payment Pending</span>
                            }
                        </p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="font-bold text-gray-900 mb-4">Items Ordered</h2>
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div className="flex-grow">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    {(item.selectedSize || item.selectedColor) && (
                                        <p className="text-xs text-gray-500">
                                            {item.selectedSize && `Size: ${item.selectedSize}`}
                                            {item.selectedSize && item.selectedColor && ' · '}
                                            {item.selectedColor && `Color: ${item.selectedColor}`}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{item.qty} × ${item.price?.toLocaleString()}</p>
                                <p className="font-bold text-gray-900 w-28 text-right">${(item.qty * item.price)?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="font-bold text-gray-900 mb-3">Price Breakdown</h2>
                    <div className="space-y-2 text-sm text-gray-600 max-w-xs ml-auto">
                        <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice?.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice}`}</span></div>
                        <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice?.toLocaleString()}</span></div>
                        <hr />
                        <div className="flex justify-between font-bold text-gray-900 text-base">
                            <span>Total</span><span>${order.totalPrice?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Status History */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-700" /> Status History</h2>
                        <div className="space-y-3">
                            {[...order.statusHistory].reverse().map((entry, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{entry.status}</p>
                                        {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                                        <p className="text-xs text-gray-400">{new Date(entry.changedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;

