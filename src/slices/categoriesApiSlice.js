// src/slices/categoriesApiSlice.js
import { apiSlice } from './apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // PUBLIC: used by the nav bar — returns category tree
        getNavCategories: builder.query({
            query: () => ({ url: '/categories/nav' }),
            providesTags: ['Category'],
        }),
        // ADMIN: all categories flat list
        getAllCategories: builder.query({
            query: () => ({ url: '/categories' }),
            providesTags: ['Category'],
        }),
        getCategoryById: builder.query({
            query: (id) => ({ url: `/categories/${id}` }),
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        createCategory: builder.mutation({
            query: (data) => ({ url: '/categories', method: 'POST', body: data }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({ url: `/categories/${id}`, method: 'PUT', body: data }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Category'],
        }),
        reorderCategories: builder.mutation({
            query: (items) => ({ url: '/categories/reorder', method: 'PUT', body: { items } }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetNavCategoriesQuery,
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useReorderCategoriesMutation,
} = categoriesApiSlice;
