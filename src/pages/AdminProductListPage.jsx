import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../slices/productsApiSlice';

const AdminProductListPage = () => {
    const navigate = useNavigate();
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const handleCreateProduct = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                const newProduct = await createProduct().unwrap();
                navigate(`/admin/product/${newProduct._id}/edit`);
            } catch (err) {
                alert(err?.data?.message || err.error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                refetch(); // Reload the product table 
            } catch (err) {
                alert(err?.data?.message || err.error);
            }
        }
    };

    if (isLoading) return <div className="py-24 text-center text-3xl font-bold">Loading Products...</div>;
    if (error) return <div className="py-24 text-center text-red-500 font-bold">Error loading products.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                <button
                    onClick={handleCreateProduct}
                    disabled={isCreating}
                    className="bg-primary hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    + Create Product
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 font-semibold text-gray-700">ID / SKU</th>
                            <th className="p-4 font-semibold text-gray-700">Image</th>
                            <th className="p-4 font-semibold text-gray-700">Name</th>
                            <th className="p-4 font-semibold text-gray-700">Price</th>
                            <th className="p-4 font-semibold text-gray-700">Category</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-b hover:bg-gray-50 transition duration-150">
                                <td className="p-4 text-gray-500 text-sm">{product._id.substring(0, 8)}...</td>
                                <td className="p-4">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                <td className="p-4">Rs. {product.price.toLocaleString()}</td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Link
                                        to={`/admin/product/${product._id}/edit`}
                                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold transition inline-block">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={isDeleting}
                                        className="text-red-500 hover:text-red-700 text-sm font-semibold transition">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductListPage;
