import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../slices/productsApiSlice';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react'; // Import an icon for the bulk delete button

const CustomSwal = Swal.mixin({
    customClass: {
        confirmButton: 'bg-primary hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg ml-3 transition duration-200',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200',
        popup: 'bg-white rounded-2xl shadow-xl border border-gray-100 p-6',
        title: 'text-2xl font-bold text-gray-900',
        htmlContainer: 'text-gray-600 font-medium',
    },
    buttonsStyling: false,
});

const AdminProductListPage = () => {
    const navigate = useNavigate();
    const { data: products, isLoading, error, refetch } = useGetProductsQuery();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    const filteredProducts = products?.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) ||
            (product.sku || '').toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }) || [];

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map(p => p._id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(pId => pId !== id));
        } else {
            setSelectedProducts([...selectedProducts, id]);
        }
    };

    const handleCreateProduct = async () => {
        try {
            const newProduct = await createProduct().unwrap();
            navigate(`/admin/product/${newProduct._id}/edit`);
        } catch (err) {
            CustomSwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err?.data?.message || err.error,
            });
        }
    };

    const handleDelete = (id) => {
        CustomSwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this product deletion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id).unwrap();
                    refetch();
                    setSelectedProducts(selectedProducts.filter(pId => pId !== id)); // Remove from selection if deleted individually
                    CustomSwal.fire('Deleted!', 'Your product has been deleted.', 'success');
                } catch (err) {
                    CustomSwal.fire({ icon: 'error', title: 'Oops...', text: err?.data?.message || err.error });
                }
            }
        });
    };

    const handleBulkDelete = () => {
        CustomSwal.fire({
            title: `Delete ${selectedProducts.length} products?`,
            text: "You won't be able to revert this action!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete all!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Execute all deletions concurrently
                    await Promise.all(selectedProducts.map(id => deleteProduct(id).unwrap()));
                    refetch();
                    setSelectedProducts([]); // Clear selection
                    CustomSwal.fire('Deleted!', `${selectedProducts.length} products have been deleted.`, 'success');
                } catch (err) {
                    CustomSwal.fire({ icon: 'error', title: 'Bulk Delete Failed', text: err?.data?.message || err.error });
                    refetch(); // Refetch anyway in case some succeeded
                }
            }
        });
    };

    if (isLoading) return <div className="py-24 text-center text-3xl font-bold">Loading Products...</div>;
    if (error) return <div className="py-24 text-center text-red-500 font-bold">Error loading products.</div>;

    const isAllSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Action Bar that appears when items are selected */}
                    {selectedProducts.length > 0 && (
                        <div className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg border border-red-200 w-full md:w-auto overflow-hidden animate-fade-in">
                            <span className="font-semibold text-sm mr-4 whitespace-nowrap">{selectedProducts.length} selected</span>
                            <button
                                onClick={handleBulkDelete}
                                disabled={isDeleting}
                                className="flex items-center text-sm font-bold bg-red-600 hover:bg-red-700 text-white py-1 transition-colors px-3 rounded whitespace-nowrap"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Selected
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 border border-gray-300 rounded-lg p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                        <button
                            onClick={handleCreateProduct}
                            disabled={isCreating}
                            className="whitespace-nowrap bg-primary hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition duration-200">
                            + Create Product
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 w-12 text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-4 font-semibold text-gray-700">ID / SKU</th>
                            <th className="p-4 font-semibold text-gray-700">Image</th>
                            <th className="p-4 font-semibold text-gray-700">Name</th>
                            <th className="p-4 font-semibold text-gray-700">Price</th>
                            <th className="p-4 font-semibold text-gray-700">Stock</th>
                            <th className="p-4 font-semibold text-gray-700">Colors</th>
                            <th className="p-4 font-semibold text-gray-700">Sizes</th>
                            <th className="p-4 font-semibold text-gray-700">Category</th>
                            <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const isSelected = selectedProducts.includes(product._id);
                            return (
                                <tr key={product._id} className={`border-b transition duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer"
                                            checked={isSelected}
                                            onChange={() => handleSelectOne(product._id)}
                                        />
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm font-mono">{product.sku || product._id.substring(0, 8)}</td>
                                    <td className="p-4">
                                        <img src={(product.images && product.images.length > 0) ? product.images[0] : product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-4">Rs. {product.price.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.countInStock}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex -space-x-1">
                                            {product.colors && product.colors.length > 0 ? (
                                                product.colors.map((c, i) => (
                                                    <div key={i} className="w-5 h-5 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: c.hex }} title={c.name}></div>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs">N/A</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs font-semibold text-gray-600">
                                        {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'N/A'}
                                    </td>
                                    <td className="p-4 text-gray-600">{product.category}</td>
                                    <td className="p-4 text-right space-x-3">
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
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="10" className="p-8 text-center text-gray-500">
                                    No products found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductListPage;
