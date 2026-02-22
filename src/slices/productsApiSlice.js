import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => {
                let url = '/products';
                if (params && params.all) {
                    url += '?all=true';
                }
                return { url };
            },
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),
        getProductDetails: builder.query({
            query: ({ id, all }) => {
                let url = `/products/${id}`;
                if (all) {
                    url += '?all=true';
                }
                return { url };
            },
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

export const { useGetProductsQuery, useGetProductDetailsQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation, useUploadProductImageMutation } = productsApiSlice;
