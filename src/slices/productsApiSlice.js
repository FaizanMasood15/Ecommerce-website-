import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({ url: '/products' }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getAdminProducts: builder.query({
            query: () => ({ url: '/products/admin/list' }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: ({ id }) => ({ url: `/products/${id}` }),
            keepUnusedDataFor: 5,
        }),
        getAdminProductDetails: builder.query({
            query: ({ id }) => ({ url: `/products/admin/${id}` }),
            keepUnusedDataFor: 5,
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/products/${productId}`,
                method: 'DELETE',
            }),
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: '/products',
                method: 'POST',
            }),
            invalidatesTags: ['Product'], // Force refetch of product list
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `/products/${data.productId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: '/upload',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetAdminProductsQuery,
    useGetProductDetailsQuery,
    useGetAdminProductDetailsQuery,
    useDeleteProductMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} = productsApiSlice;
