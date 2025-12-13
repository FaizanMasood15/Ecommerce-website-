// src/context/CartContext.jsx (Removing hardcoded demo items)

import React, { createContext, useState, useContext } from 'react';
import { ALL_PRODUCTS } from '../data/products';

const CartContext = createContext();

// Function to find product details by ID and calculate total price
const getProductDetails = (id) => {
    return ALL_PRODUCTS.find(p => p.id === id);
};

export const CartProvider = ({ children }) => {
    // CRITICAL FIX: Change initial state to an empty array
    const [cartItems, setCartItems] = useState([]); 

    // Function to add a product to the cart
    const addToCart = (id, quantity, color, size) => {
        const numericId = parseInt(id);
        setCartItems(prevItems => {
            // Check if the item (matching ID, color, and size) already exists
            const existingItemIndex = prevItems.findIndex(item => 
                item.id === numericId && item.color === color && item.size === size
            );

            if (existingItemIndex > -1) {
                // Item exists: increase quantity
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Item is new: add to cart
                return [...prevItems, { id:numericId, quantity, color, size }];
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
        const product = getProductDetails(item.id);
        // CRITICAL FIX: Ensure price calculation is robust for products with no details
        const priceString = product ? product.price : '0'; 
        const price = parseFloat(priceString.toString().replace(/[Rp\.]/g, ''));

        return {
            ...item,
            product,
            price,
            totalPrice: price * item.quantity,
        };
    }).filter(item => item.product); // Remove items if product details couldn't be found (safety check)

    const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <CartContext.Provider value={{ cartItems: cartData, subtotal, addToCart, removeItem }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);