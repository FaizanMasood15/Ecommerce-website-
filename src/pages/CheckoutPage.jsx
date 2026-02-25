// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, CreditCard, Truck, Tag, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useValidateCouponMutation } from '../slices/couponApiSlice';

const PAYMENT_METHODS = [
    { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
    { id: 'BankTransfer', label: 'Bank Transfer', icon: '🏦' },
    { id: 'EasyPaisa', label: 'EasyPaisa / JazzCash', icon: '📱' },
];

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, subtotal } = useCart();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
        phone: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [errors, setErrors] = useState({});

    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [validateCoupon, { isLoading: isCouponLoading }] = useValidateCouponMutation();

    const shippingCost = subtotal > 5000 ? 0 : 250;
    const tax = 0;
    const discountAmount = appliedCoupon?.discountAmount || 0;
    const total = subtotal + shippingCost + tax - discountAmount;

    const validate = () => {
        const newErrors = {};
        if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
        if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
        if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        sessionStorage.setItem('checkoutData', JSON.stringify({
            shippingAddress,
            paymentMethod,
            shippingCost,
            tax,
            discountAmount,
            couponCode: appliedCoupon?.code || '',
        }));
        navigate('/place-order');
    };

    const handleChange = (e) => {
        setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-5xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p className="text-gray-500 mb-8">{cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left: Address + Payment */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-amber-700" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={shippingAddress.fullName}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.fullName ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="Muhammad Faizan"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingAddress.address}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="House #1, Street 5, Model Town"
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.city ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="Lahore"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={shippingAddress.postalCode}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                            placeholder="54000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                                            placeholder="0300-1234567"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-amber-700" /> Payment Method
                                </h2>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-3 border-2 rounded-lg px-4 py-3 cursor-pointer transition ${paymentMethod === method.id ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-amber-700"
                                            />
                                            <span className="text-xl">{method.icon}</span>
                                            <span className="font-medium text-gray-800">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-amber-700" /> Order Summary
                                </h2>
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="flex justify-between gap-2">
                                            <span className="truncate pr-2">{item.product?.name} × {item.quantity}</span>
                                            <span className="flex-shrink-0">Rs. {item.totalPrice?.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr />
                                {/* Coupon Code Input */}
                                <div className="mt-3">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Coupon Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); setAppliedCoupon(null); }}
                                            placeholder="Enter code"
                                            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                                        />
                                        <button
                                            type="button"
                                            disabled={!couponCode || isCouponLoading}
                                            onClick={async () => {
                                                setCouponError('');
                                                setAppliedCoupon(null);
                                                try {
                                                    const result = await validateCoupon({ code: couponCode, orderTotal: subtotal }).unwrap();
                                                    setAppliedCoupon(result);
                                                } catch (err) {
                                                    setCouponError(err?.data?.message || 'Invalid coupon');
                                                }
                                            }}
                                            className="px-3 py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {isCouponLoading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {couponError}</p>}
                                    {appliedCoupon && <p className="text-green-600 text-xs mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {appliedCoupon.description || `${appliedCoupon.discountValue}${appliedCoupon.discountType === 'percentage' ? '%' : ' Rs.'} off applied!`}</p>}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mt-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>Rs. {subtotal?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : `Rs. ${shippingCost}`}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Coupon ({appliedCoupon.code})</span>
                                            <span>- Rs. {discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <hr />
                                    <div className="flex justify-between font-bold text-gray-900 text-base">
                                        <span>Total</span>
                                        <span>Rs. {total?.toLocaleString()}</span>
                                    </div>
                                    {shippingCost > 0 && (
                                        <p className="text-xs text-green-600 text-center mt-1">
                                            Add Rs. {(5001 - subtotal).toLocaleString()} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="mt-6 w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-lg transition"
                                >
                                    Review Order
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
