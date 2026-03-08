// src/pages/WishlistPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/wishlistApiSlice';
import { useCart } from '../context/CartContext';
import { Heart, Loader, Trash2, ShoppingCart } from 'lucide-react';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { addToCart } = useCart();

    const { data: wishlist, isLoading, error } = useGetWishlistQuery(undefined, {
        skip: !userInfo,
    });
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    if (!userInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Heart className="w-16 h-16 text-gray-200" />
                <p className="text-gray-500 text-lg">Please log in to view your wishlist</p>
                <Link to="/login" className="bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-800 transition">Login</Link>
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
                        <Link to="/shop" className="bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-800 transition">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {products.map(({ product, addedAt }) => (
                            product && (
                                <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition">
                                    {/* Product Image */}
                                    <div className="relative">
                                        <Link to={`/shop/${product._id}`}>
                                            <img
                                                src={product.images?.[0] || product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => removeFromWishlist(product._id)}
                                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow text-red-400 hover:text-red-600 transition"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link to={`/shop/${product._id}`}>
                                            <h3 className="font-semibold text-gray-900 hover:text-amber-700 transition text-sm truncate">{product.name}</h3>
                                        </Link>
                                        <p className="text-amber-700 font-bold mt-1">${Number(product.price).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Added {new Date(addedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                                        </p>
                                        <button
                                            onClick={() => {
                                                addToCart(product, 1, '', '', '', null);
                                                navigate('/cart');
                                            }}
                                            className="mt-3 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-amber-700 text-white text-sm font-semibold py-2 rounded-lg transition"
                                        >
                                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                                        </button>
                                    </div>
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

