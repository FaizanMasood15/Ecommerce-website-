import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Order'],
        }),
        getOrderDetails: builder.query({
            query: (id) => ({ url: `/orders/${id}` }),
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        getMyOrders: builder.query({
            query: () => ({ url: '/orders/myorders' }),
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: () => ({ url: '/orders' }),
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status, note }) => ({
                url: `/orders/${id}/status`,
                method: 'PUT',
                body: { status, note },
            }),
            invalidatesTags: ['Order'],
        }),
        markOrderAsPaid: builder.mutation({
            query: ({ id, paymentResult }) => ({
                url: `/orders/${id}/pay`,
                method: 'PUT',
                body: paymentResult,
            }),
            invalidatesTags: ['Order'],
        }),
        markOrderAsDelivered: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/deliver`,
                method: 'PUT',
            }),
            invalidatesTags: ['Order'],
        }),
        getAnalytics: builder.query({
            query: () => ({ url: '/orders/analytics' }),
            providesTags: ['Order'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useMarkOrderAsPaidMutation,
    useMarkOrderAsDeliveredMutation,
    useGetAnalyticsQuery,
} = ordersApiSlice;
