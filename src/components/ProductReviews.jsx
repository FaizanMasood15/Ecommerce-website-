// src/components/ProductReviews.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
} from '../slices/reviewsApiSlice';
import { Star, CheckCircle, Loader, AlertCircle, Trash2, User } from 'lucide-react';

// Star display component
const StarRating = ({ rating, size = 'sm', interactive = false, onChange }) => {
    const [hovered, setHovered] = useState(0);
    const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sz} transition-colors ${star <= (interactive ? (hovered || rating) : rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 fill-gray-100'
                        } ${interactive ? 'cursor-pointer' : ''}`}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onChange && onChange(star)}
                />
            ))}
        </div>
    );
};

// Rating Distribution Bar
const DistributionBar = ({ label, count, total }) => {
    const percent = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 w-5 text-right">{label}</span>
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
            <div className="flex-grow bg-gray-100 rounded-full h-2">
                <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-gray-500 w-6 text-left">{count}</span>
        </div>
    );
};

const ProductReviews = ({ productId, productRating = 0, numReviews = 0 }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const { data, isLoading, error } = useGetProductReviewsQuery({ productId });
    const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [formMsg, setFormMsg] = useState('');
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormMsg('');
        setFormError('');
        if (!title.trim() || !comment.trim()) {
            setFormError('Please fill in all fields.');
            return;
        }
        try {
            await createReview({ productId, rating, title, comment }).unwrap();
            setRating(5);
            setTitle('');
            setComment('');
            setFormMsg('Review submitted! Thank you.');
        } catch (err) {
            setFormError(err?.data?.message || 'Failed to submit review.');
        }
    };

    const reviews = data?.reviews || [];
    const distribution = data?.distribution || {};
    const total = data?.total || 0;

    return (
        <section className="mt-12 pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {/* Rating Summary */}
            {total > 0 && (
                <div className="flex flex-col sm:flex-row gap-6 mb-8 bg-amber-50 rounded-xl p-5">
                    <div className="text-center flex-shrink-0">
                        <p className="text-5xl font-black text-gray-900">{productRating.toFixed(1)}</p>
                        <StarRating rating={Math.round(productRating)} size="md" />
                        <p className="text-sm text-gray-500 mt-1">{total} review{total !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex-grow space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <DistributionBar key={star} label={star} count={distribution[star] || 0} total={total} />
                        ))}
                    </div>
                </div>
            )}

            {/* Review List */}
            {isLoading && <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-amber-700" /></div>}

            {!isLoading && reviews.length === 0 && (
                <p className="text-gray-400 text-center py-6">No reviews yet. Be the first to review!</p>
            )}

            <div className="space-y-4 mb-8">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-50">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-amber-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</p>
                                    <div className="flex items-center gap-2">
                                        <StarRating rating={review.rating} />
                                        {review.isVerifiedPurchase && (
                                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                                <CheckCircle className="w-3 h-3" /> Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                {(userInfo?._id === review.user?._id || userInfo?.isAdmin) && (
                                    <button
                                        onClick={() => deleteReview(review._id)}
                                        className="text-red-400 hover:text-red-600 transition"
                                        title="Delete review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="font-semibold text-gray-800 mt-3">{review.title}</p>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.comment}</p>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            {userInfo ? (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                    {formMsg && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2 mb-4 text-sm">
                            <CheckCircle className="w-4 h-4" /> {formMsg}
                        </div>
                    )}
                    {formError && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm">
                            <AlertCircle className="w-4 h-4" /> {formError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                            <StarRating rating={rating} size="md" interactive onChange={setRating} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell others what you think about this product..."
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 text-sm"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4 text-sm">
                    <a href="/login" className="text-amber-700 font-semibold hover:underline">Log in</a> to write a review.
                </p>
            )}
        </section>
    );
};

export { StarRating };
export default ProductReviews;
