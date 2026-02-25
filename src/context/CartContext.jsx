// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add item to cart (or increase quantity if same variant)
    const addToCart = (product, quantity, color, size, colorHex, variantId) => {
        const id = product._id || product.id;
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item =>
                item.id === id && item.color === color && item.size === size
            );

            if (existingItemIndex > -1) {
                return prevItems.map(item =>
                    item.id === id && item.color === color && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { id, product, quantity, color, size, colorHex: colorHex || '', variantId: variantId || null }];
            }
        });
    };

    // Remove a specific item from cart
    const removeItem = (id, color, size) => {
        setCartItems(prevItems => prevItems.filter(item =>
            !(item.id === id && item.color === color && item.size === size)
        ));
    };

    // Update quantity of a specific item (-1 quantity removes item)
    const updateQuantity = (id, color, size, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id, color, size);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id && item.color === color && item.size === size
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    // Clear all items from cart (called after order is placed)
    const clearCart = () => {
        setCartItems([]);
    };

    // Compute derived cart data
    const cartData = cartItems.map(item => {
        const price = parseFloat(item.product?.price?.toString().replace(/[^0-9.]/g, '') || '0');
        return {
            ...item,
            price,
            totalPrice: price * item.quantity,
        };
    });

    const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItemCount = cartData.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems: cartData, subtotal, totalItemCount, addToCart, removeItem, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);