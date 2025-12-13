// src/components/CartSidebar.jsx

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Accept isOpen and onClose props for controlling visibility
const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, subtotal, removeItem } = useCart();

    // Formatting currency for display
    const formatCurrency = (amount) => `Rs. ${amount.toLocaleString('en-IN')}.00`;

    // Calculate item count (not unique count, but total items)
    const totalItems = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <>
            {/* Overlay (Appears dark when sidebar is open) */}
            <div 
                onClick={onClose}
                className={`fixed inset-0 bg-black bg-opacity-3 z-40 transition-opacity duration-600 
                            ${isOpen ? 'opacity-35 visible' : 'opacity-100 invisible'}`}
            ></div>

            {/* Sidebar Panel */}
            <div 
                className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-50 
                            transform transition-transform duration-500 ease-in-out
                            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Shopping Cart 
                        {totalItems > 0 && <span className="text-primary text-base font-medium ml-2">({totalItems}items)</span>}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition duration-150">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body: Cart Items List */}
                <div className="p-4 h-[calc(100vh-160px)] overflow-y-auto space-y-4">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="flex items-start space-x-4 border-b pb-4">
                                {/* Product Image */}
                                <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                
                                {/* Item Details */}
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {formatCurrency(item.price)} x {item.quantity} 
                                        {item.color && item.size && (
                                            <span className='ml-2 text-xs'>
                                                ({item.color}/{item.size})
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-primary font-medium mt-1">Total: {formatCurrency(item.totalPrice)}</p>
                                </div>
                                
                                {/* Remove Button */}
                                <button 
                                    onClick={() => removeItem(item.id, item.color, item.size)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer and Subtotal */}
                <div className="absolute bottom-0 w-full p-6 border-t bg-white">
                    <div className="flex justify-between text-xl font-bold mb-4">
                        <span>Subtotal:</span>
                        <span className="text-primary">{formatCurrency(subtotal)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button className="flex-1 border border-gray-900 text-gray-900 hover:bg-gray-100 py-3 rounded-lg font-semibold transition duration-150">
                            View Cart
                        </button>
                        <button className="flex-1 bg-primary text-white hover:bg-amber-700 py-3 rounded-lg font-semibold transition duration-150">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;