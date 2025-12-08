// src/context/CartContext.jsx

import React, { createContext, useState, useContext } from 'react';
import { ALL_PRODUCTS } from '../data/products'; // Use centralized data

const CartContext = createContext();

// Function to find product details by ID and calculate total price
const getProductDetails = (id) => {
    // We'll use product ID 1 for a hardcoded placeholder if needed, 
    // but the final solution uses the ALL_PRODUCTS array.
    return ALL_PRODUCTS.find(p => p.id === id);
};

export const CartProvider = ({ children }) => {
    // Initial cart state: an array of objects {id, quantity, color, size}
    const [cartItems, setCartItems] = useState([
        // Hardcoded example to show content immediately
        { id: 1, quantity: 1, color: 'Red', size: 'XL' },
        { id: 3, quantity: 2, color: 'Default', size: 'L' },
    ]);

    // Function to add a product to the cart
    const addToCart = (id, quantity, color, size) => {
        setCartItems(prevItems => {
            // Check if the item (matching ID, color, and size) already exists
            const existingItemIndex = prevItems.findIndex(item => 
                item.id === id && item.color === color && item.size === size
            );

            if (existingItemIndex > -1) {
                // Item exists: increase quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Item is new: add to cart
                return [...prevItems, { id, quantity, color, size }];
            }
        });
    };

    // Function to remove an item completely
    const removeItem = (id, color, size) => {
        setCartItems(prevItems => prevItems.filter(item => 
            !(item.id === id && item.color === color && item.size === size)
        ));
    };

    // Calculate total price and item count
    const cartData = cartItems.map(item => {
        const product = getProductDetails(item.id);
        const price = parseFloat(product.price.replace(/[Rp\.]/g, ''));
        return {
            ...item,
            product,
            price,
            totalPrice: price * item.quantity,
        };
    });

    const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <CartContext.Provider value={{ cartItems: cartData, subtotal, addToCart, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);