// src/pages/WishlistPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/wishlistApiSlice';
import { Heart, Loader, Trash2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const { data: wishlist, isLoading } = useGetWishlistQuery(undefined, {
        skip: !userInfo,
    });
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    if (!userInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Heart className="w-16 h-16 text-gray-200" />
                <p className="text-gray-500 text-lg">Please log in to view your wishlist</p>
                <Link to="/login" className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-stone-800 transition">Login</Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-amber-700" />
            </div>
        );
    }

    const products = wishlist?.products || [];

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-7 h-7 text-red-500 fill-red-500" />
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <span className="text-gray-400 font-medium">({products.length} items)</span>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-6">Save products you love and come back to them later</p>
                        <Link to="/shop" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-800 transition">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map(({ product, addedAt }) => (
                            product && (
                                <div key={product._id} className="relative">
                                    <ProductCard product={product} />
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="absolute top-3 right-3 z-30 p-2 bg-white/90 rounded-full shadow text-red-400 hover:text-red-600 transition"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Added {new Date(addedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;


