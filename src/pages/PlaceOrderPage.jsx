// src/pages/PlaceOrderPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../context/CartContext';
import { useCreateOrderMutation, useCreateGuestOrderMutation } from '../slices/ordersApiSlice';
import { CheckCircle, Loader, AlertCircle } from 'lucide-react';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const { cartItems, subtotal, clearCart } = useCart();
    const { userInfo } = useSelector((state) => state.auth);

    const [createOrder, { isLoading: isLoadingAuth, error: errorAuth }] = useCreateOrderMutation();
    const [createGuestOrder, { isLoading: isLoadingGuest, error: errorGuest }] = useCreateGuestOrderMutation();

    const isLoading = isLoadingAuth || isLoadingGuest;
    const error = errorAuth || errorGuest;

    const [checkoutData, setCheckoutData] = useState(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('checkoutData');
        if (!stored) {
            navigate('/checkout');
        } else {
            setCheckoutData(JSON.parse(stored));
        }
    }, [navigate]);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    if (!checkoutData) return null;

    const {
        shippingAddress,
        paymentMethod,
        shippingCost,
        tax,
        discountAmount,
        couponCode,
        guestEmail,
        deviceId,
        clientOrderRef,
    } = checkoutData;

    const total = subtotal + shippingCost + tax - (discountAmount || 0);

    const handlePlaceOrder = async () => {
        const orderItems = cartItems.map((item) => ({
            name: item.product?.name,
            qty: item.quantity,
            image: item.product?.image,
            price: item.price,
            selectedSize: item.size || '',
            selectedColor: item.color || '',
            selectedColorHex: item.colorHex || '',
            product: item.id,
            variantId: item.variantId || null,
        }));

        const payload = {
            orderItems,
            shippingAddress,
            paymentMethod,
            couponCode: couponCode || '',
            deviceId: deviceId || '',
            clientOrderRef: clientOrderRef || '',
        };

        try {
            if (userInfo) {
                const res = await createOrder(payload).unwrap();
                clearCart();
                sessionStorage.removeItem('checkoutData');
                navigate(`/orders/${res._id}`);
            } else {
                const res = await createGuestOrder({ ...payload, guestEmail }).unwrap();
                clearCart();
                sessionStorage.removeItem('checkoutData');
                navigate(`/guest-order/${res.order._id}?token=${encodeURIComponent(res.guestAccessToken)}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-5xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Your Order</h1>

                {error && (
                    <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error?.data?.message || 'Failed to place order. Please try again.'}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {!userInfo && guestEmail && (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                Confirmation will be sent to <strong>{guestEmail}</strong>
                            </div>
                        )}

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-bold text-gray-900">Shipping Address</h2>
                                <Link to="/checkout" className="text-amber-700 text-sm hover:underline">Edit</Link>
                            </div>
                            <p className="text-gray-700 font-medium">{shippingAddress.fullName}</p>
                            <p className="text-gray-600 text-sm mt-1">{shippingAddress.address}</p>
                            <p className="text-gray-600 text-sm">{shippingAddress.city}, {shippingAddress.postalCode}</p>
                            <p className="text-gray-600 text-sm">{shippingAddress.country}</p>
                            <p className="text-gray-600 text-sm">Phone: {shippingAddress.phone}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-bold text-gray-900">Payment Method</h2>
                                <Link to="/checkout" className="text-amber-700 text-sm hover:underline">Edit</Link>
                            </div>
                            <p className="text-gray-700">
                                {paymentMethod === 'COD' ? 'Cash on Delivery' :
                                    paymentMethod === 'BankTransfer' ? 'Bank Transfer' :
                                        'EasyPaisa / JazzCash'}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <img
                                            src={item.product?.image}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">{item.product?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.size && `Size: ${item.size}`}
                                                {item.size && item.color && ' / '}
                                                {item.color && `Color: ${item.color}`}
                                            </p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p className="text-gray-600">{item.quantity} x ${item.price?.toLocaleString()}</p>
                                            <p className="font-bold text-gray-900">${item.totalPrice?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Total</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `$${shippingCost}`}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>Coupon {couponCode && `(${couponCode})`}</span>
                                        <span>- ${discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="flex justify-between font-bold text-gray-900 text-base">
                                    <span>Total</span>
                                    <span>${total?.toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isLoading}
                                className="mt-6 w-full bg-black hover:bg-stone-800 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader className="w-4 h-4 animate-spin" /> Placing Order...</>
                                ) : (
                                    <><CheckCircle className="w-4 h-4" /> Confirm Order</>
                                )}
                            </button>
                            {!userInfo && (
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    Checking out as guest / <Link to="/login" className="text-amber-700 hover:underline">Sign in</Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;

