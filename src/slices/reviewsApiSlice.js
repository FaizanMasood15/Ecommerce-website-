// src/slices/reviewsApiSlice.js
import { apiSlice } from './apiSlice';

export const reviewsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProductReviews: builder.query({
            query: ({ productId, page = 1 }) => ({
                url: `/reviews/product/${productId}?page=${page}`,
            }),
            providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
        }),
        createReview: builder.mutation({
            query: ({ productId, ...data }) => ({
                url: `/reviews/product/${productId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Review', id: productId },
                { type: 'Product', id: productId },
            ],
        }),
        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Review'],
        }),
    }),
});

export const {
    useGetProductReviewsQuery,
    useCreateReviewMutation,
    useDeleteReviewMutation,
} = reviewsApiSlice;
