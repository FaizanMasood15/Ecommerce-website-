import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '/api' });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product', 'User', 'Order', 'Wishlist', 'Review', 'Coupon', 'Category'],
    endpoints: (builder) => ({}),
});
