// src/components/CartSidebar.jsx
import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, subtotal, removeItem } = useCart();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const formatCurrency = (amount) => `$${Number(amount).toLocaleString('en-US')}`;

    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

    const handleViewCart = () => {
        onClose();
        navigate('/cart');
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 
                            ${isOpen ? 'opacity-30 visible' : 'opacity-0 invisible pointer-events-none'}`}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-2xl z-50 
                            flex flex-col transform transition-transform duration-400 ease-in-out
                            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">
                        Shopping Cart
                        {totalItems > 0 && (
                            <span className="text-amber-700 text-sm font-medium ml-2">({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                        )}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body: Cart Items (scrollable) */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center mt-16">
                            <ShoppingBag className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400 font-medium">Your cart is empty</p>
                            <button
                                onClick={() => { onClose(); navigate('/shop'); }}
                                className="mt-4 text-amber-700 font-semibold hover:underline text-sm"
                            >
                                Browse Products →
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 border-b pb-4">
                                <img
                                    src={(item.product?.images && item.product.images.length > 0) ? item.product.images[0] : item.product?.image}
                                    alt={item.product?.name}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-semibold text-gray-900 truncate">{item.product?.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        {formatCurrency(item.price)} × {item.quantity}
                                        {(item.color || item.size) && (
                                            <span className="ml-1">({[item.size, item.color].filter(Boolean).join('/')})</span>
                                        )}
                                    </p>
                                    <p className="text-amber-700 font-semibold text-sm mt-0.5">{formatCurrency(item.totalPrice)}</p>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id, item.color, item.size)}
                                    className="text-red-400 hover:text-red-600 transition p-1 flex-shrink-0"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer (sticky) */}
                {cartItems.length > 0 && (
                    <div className="flex-shrink-0 p-5 border-t bg-white">
                        <div className="flex justify-between text-lg font-bold mb-4 text-gray-900">
                            <span>Subtotal</span>
                            <span className="text-amber-700">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleViewCart}
                                className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-100 py-2.5 rounded-lg font-semibold transition text-sm"
                            >
                                View Cart
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 bg-black text-white hover:bg-stone-800 py-2.5 rounded-lg font-semibold transition text-sm"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;

