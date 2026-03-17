// src/pages/GuestOrderConfirmationPage.jsx
import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useGetGuestOrderQuery } from '../slices/ordersApiSlice';
import { CheckCircle, Loader, AlertCircle, ShoppingBag, MapPin, UserPlus } from 'lucide-react';

const GuestOrderConfirmationPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const { data: order, isLoading, error } = useGetGuestOrderQuery({ id, token }, { skip: !id || !token });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    if (!token) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-3" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid Guest Link</h2>
                <p className="text-gray-500 mb-6">This order link is missing its access token.</p>
                <Link to="/" className="text-gray-900 hover:underline font-medium">Return to Home</Link>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-3" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                <p className="text-gray-500 mb-6">We couldn't find this order. It may have expired or the link is invalid.</p>
                <Link to="/" className="text-gray-900 hover:underline font-medium">← Return to Home</Link>
            </div>
        );
    }

    const paymentLabel = {
        COD: '💵 Cash on Delivery',
        BankTransfer: '🏦 Bank Transfer',
        EasyPaisa: '📱 EasyPaisa / JazzCash',
    }[order.paymentMethod] || order.paymentMethod;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-2xl px-4">

                {/* Success banner */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 mb-6 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-9 h-9 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
                    <p className="text-gray-500 text-sm">
                        Thank you! Your order <span className="font-mono font-bold text-gray-700">#{order._id.slice(-8).toUpperCase()}</span> has been placed successfully.
                    </p>
                    {order.guestEmail && (
                        <p className="text-xs text-gray-400 mt-2">
                            A confirmation will be sent to <strong>{order.guestEmail}</strong>
                        </p>
                    )}
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-900" />
                        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Shipping To</h2>
                    </div>
                    <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress.address}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p className="text-sm text-gray-500">📞 {order.shippingAddress.phone}</p>}
                    <p className="text-sm text-gray-500 mt-1">Payment: {paymentLabel}</p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                        <ShoppingBag className="w-4 h-4 text-gray-900" />
                        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Items ({order.orderItems.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {order.orderItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                    {(item.selectedSize || item.selectedColor) && (
                                        <p className="text-xs text-gray-400">
                                            {item.selectedSize && `Size: ${item.selectedSize}`}
                                            {item.selectedSize && item.selectedColor && ' · '}
                                            {item.selectedColor && `Color: ${item.selectedColor}`}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right text-sm flex-shrink-0">
                                    <p className="text-gray-500">{item.qty} × ${item.price?.toLocaleString()}</p>
                                    <p className="font-bold text-gray-900">${(item.qty * item.price)?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-3 space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${order.itemsPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{order.shippingPrice === 0 ? <span className="text-green-600">Free</span> : `$${order.shippingPrice}`}</span>
                        </div>
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({order.couponCode})</span>
                                <span>− ${order.discountAmount?.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
                            <span>Total</span>
                            <span>${order.totalPrice?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* CTA — non-aggressive account suggestion */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 flex items-start gap-3">
                    <UserPlus className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Want to track your orders?</p>
                        <p className="text-xs text-gray-700 mt-0.5">Create a free account to view your order history and get faster checkout next time.</p>
                        <div className="flex gap-4 mt-3">
                            <Link to="/register" className="text-xs font-bold text-white bg-black hover:bg-gray-800 px-3 py-1.5 rounded-full transition">
                                Create Account
                            </Link>
                            <Link to="/shop" className="text-xs font-medium text-gray-900 hover:underline self-center">
                                Continue Shopping →
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GuestOrderConfirmationPage;

