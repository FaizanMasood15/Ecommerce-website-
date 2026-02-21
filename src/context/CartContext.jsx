// src/context/CartContext.jsx (Removing hardcoded demo items)

import React, { createContext, useState, useContext } from 'react';
// Removed ALL_PRODUCTS static import
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // CRITICAL FIX: Change initial state to an empty array
    const [cartItems, setCartItems] = useState([]);

    // Function to add a product to the cart
    const addToCart = (product, quantity, color, size) => {
        const id = product._id || product.id;
        setCartItems(prevItems => {
            // Check if the item (matching ID, color, and size) already exists
            const existingItemIndex = prevItems.findIndex(item =>
                item.id === id && item.color === color && item.size === size
            );

            if (existingItemIndex > -1) {
                // Item exists: increase quantity
                return prevItems.map(item =>
                    item.id === id &&
                        item.color === color &&
                        item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );

            } else {
                // Item is new: add to cart
                return [...prevItems, { id, product, quantity, color, size }];
            }
        });
    };

    // ... (removeItem logic remains the same) ...
    const removeItem = (id, color, size) => {
        setCartItems(prevItems => prevItems.filter(item =>
            !(item.id === id && item.color === color && item.size === size)
        ));
    };


    // Calculate total price and item count
    const cartData = cartItems.map(item => {
        // CRITICAL FIX: Ensure price calculation is robust for products with no details
        const priceString = item.product?.price ? item.product.price : '0';
        const price = parseFloat(priceString.toString().replace(/[Rp\.]/g, ''));

        return {
            ...item,
            price,
            totalPrice: price * item.quantity,
        };
    }); // Remove items if product details couldn't be found (safety check)

    const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <CartContext.Provider value={{ cartItems: cartData, subtotal, addToCart, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);