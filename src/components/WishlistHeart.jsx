// src/components/WishlistHeart.jsx
// Reusable heart button to toggle wishlist for any product
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../slices/wishlistApiSlice';

const WishlistHeart = ({ productId, className = '', variant = 'default' }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !userInfo });
    const [toggleWishlist, { isLoading }] = useToggleWishlistMutation();

    const isInWishlist = wishlist?.products?.some(p => p.product?._id === productId || p.product === productId);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo) {
            navigate('/login');
            return;
        }
        try {
            await toggleWishlist(productId).unwrap();
        } catch (err) {
            console.error('Wishlist toggle error:', err);
        }
    };

    if (variant === 'card') {
        return (
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`transition-all ${className}`}
                title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
                    <path
                        d="M12.1 20.3l-1.1-1C6.1 15 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.7 0 3.2.8 4.2 2.1C13 4.8 14.5 4 16.2 4 18.9 4 21 6.1 21 8.8c0 3.4-3.1 6.2-7.9 10.5l-1 .9z"
                        fill={isInWishlist ? '#000000' : '#ffffff'}
                        stroke="#000000"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all ${isInWishlist
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white/70 text-gray-400 hover:text-red-400'
                } ${className}`}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg viewBox="0 0 24 24" className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} aria-hidden="true">
                <path d="M12.1 20.3l-1.1-1C6.1 15 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.7 0 3.2.8 4.2 2.1C13 4.8 14.5 4 16.2 4 18.9 4 21 6.1 21 8.8c0 3.4-3.1 6.2-7.9 10.5l-1 .9z" />
            </svg>
        </button>
    );
};

export default WishlistHeart;
