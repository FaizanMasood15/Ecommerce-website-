// src/slices/couponApiSlice.js
import { apiSlice } from './apiSlice';

export const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        validateCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupons/validate',
                method: 'POST',
                body: data,
            }),
        }),
        getAllCoupons: builder.query({
            query: () => ({ url: '/coupons' }),
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation({
            query: (data) => ({
                url: '/coupons',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/coupons/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => ({
                url: `/coupons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coupon'],
        }),
    }),
});

export const {
    useValidateCouponMutation,
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} = couponApiSlice;
