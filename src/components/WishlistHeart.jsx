// src/components/WishlistHeart.jsx
// Reusable heart button to toggle wishlist for any product
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useGetWishlistQuery, useToggleWishlistMutation } from '../slices/wishlistApiSlice';

const WishlistHeart = ({ productId, className = '' }) => {
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
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500' : ''}`} />
        </button>
    );
};

export default WishlistHeart;
