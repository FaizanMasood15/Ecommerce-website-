// src/slices/wishlistApiSlice.js
import { apiSlice } from './apiSlice';

export const wishlistApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWishlist: builder.query({
            query: () => ({ url: '/wishlist' }),
            providesTags: ['Wishlist'],
        }),
        toggleWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Wishlist'],
        }),
        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Wishlist'],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    useToggleWishlistMutation,
    useRemoveFromWishlistMutation,
} = wishlistApiSlice;
