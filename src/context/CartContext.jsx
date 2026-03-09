// src/context/CartContext.jsx
// Cart state persists to localStorage so items survive page refresh
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const LEGACY_CART_STORAGE_KEY = 'faizanbutt_cart';
const CART_STORAGE_KEY = 'faizanmasood15_cart';

// Load persisted cart from localStorage on startup
const loadCart = () => {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) return JSON.parse(saved);

        // One-time migration from legacy key to the new project key
        const legacySaved = localStorage.getItem(LEGACY_CART_STORAGE_KEY);
        if (legacySaved) {
            localStorage.setItem(CART_STORAGE_KEY, legacySaved);
            localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
            return JSON.parse(legacySaved);
        }

        return [];
    } catch {
        return [];
    }
};

// Save raw cart items (before price computation) to localStorage
const saveCart = (items) => {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Silently fail (e.g. private browsing, full storage)
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(loadCart);

    // Persist to localStorage every time cart changes
    useEffect(() => {
        saveCart(cartItems);
    }, [cartItems]);

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
                return [...prevItems, {
                    id,
                    product,
                    quantity,
                    color: color || '',
                    size: size || '',
                    colorHex: colorHex || '',
                    variantId: variantId || null,
                }];
            }
        });
    };

    // Remove a specific item from cart
    const removeItem = (id, color, size) => {
        setCartItems(prevItems => prevItems.filter(item =>
            !(item.id === id && item.color === color && item.size === size)
        ));
    };

    // Update quantity of a specific item (0 or negative removes item)
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
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    // Compute derived cart data (add price + totalPrice per item)
    const cartData = cartItems.map(item => {
        const price = parseFloat(
            item.product?.price?.toString().replace(/[^0-9.]/g, '') || '0'
        );
        return {
            ...item,
            price,
            totalPrice: price * item.quantity,
        };
    });

    const subtotal = cartData.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalItemCount = cartData.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems: cartData,
            subtotal,
            totalItemCount,
            addToCart,
            removeItem,
            updateQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
