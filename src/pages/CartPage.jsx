// src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

const CartPage = () => {
    const { cartItems, subtotal, removeItem, updateQuantity } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
                <ShoppingBag className="w-20 h-20 text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
                <p className="text-gray-500">Looks like you haven't added any items yet.</p>
                <Link
                    to="/shop"
                    className="mt-2 bg-amber-700 text-white px-8 py-3 font-semibold hover:bg-amber-800 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-6xl px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item, index) => (
                            <div key={`${item.id}-${item.color}-${item.size}-${index}`}
                                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-start">
                                <img
                                    src={item.product?.image}
                                    alt={item.product?.name}
                                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">
                                        {item.product?.name}
                                    </h3>
                                    {(item.size || item.color) && (
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {item.size && <span>Size: {item.size}</span>}
                                            {item.size && item.color && <span> · </span>}
                                            {item.color && (
                                                <span className="inline-flex items-center gap-1">
                                                    Color: {item.color}
                                                    {item.colorHex && (
                                                        <span
                                                            className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                                                            style={{ backgroundColor: item.colorHex }}
                                                        />
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                    <p className="text-amber-700 font-bold mt-1">
                                        Rs. {item.price?.toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-3 mt-3">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                                className="px-2 py-1 hover:bg-gray-100 transition"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 py-1 font-semibold border-x border-gray-300">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                                className="px-2 py-1 hover:bg-gray-100 transition"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id, item.color, item.size)}
                                            className="text-red-400 hover:text-red-600 transition ml-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-gray-900">
                                        Rs. {item.totalPrice?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                                    <span>Rs. {subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Calculated at checkout</span>
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between text-base font-bold text-gray-900">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal?.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="mt-6 w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/shop"
                                className="mt-3 w-full block text-center text-amber-700 hover:text-amber-800 font-medium text-sm"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
