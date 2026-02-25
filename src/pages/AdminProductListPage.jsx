import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductMutation } from '../slices/productsApiSlice';
import Swal from 'sweetalert2';
import { Trash2, Edit2, Check, X, Eye, EyeOff, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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
    const { data: products, isLoading, error, refetch } = useGetProductsQuery({ all: true });
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation(); // For inline edits

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Inline Edit State
    const [editingCell, setEditingCell] = useState({ id: null, field: null, value: '' });

    let filteredProducts = products?.filter((product) => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) ||
            (product.sku || '').toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    }) || [];

    const getProductStock = (product) => {
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((total, variant) => total + (Number(variant.countInStock) || 0), 0);
        }
        return Number(product.countInStock) || 0;
    };

    if (sortConfig.key) {
        filteredProducts.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            if (sortConfig.key === 'countInStock') {
                valA = getProductStock(a);
                valB = getProductStock(b);
            }

            if (valA < valB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-gray-400 inline" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="w-3.5 h-3.5 ml-1 text-amber-700 inline" />
            : <ArrowDown className="w-3.5 h-3.5 ml-1 text-amber-700 inline" />;
    };

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

    // --- Inline Editing Logic ---
    const handleInlineEditStart = (product, field) => {
        setEditingCell({ id: product._id, field, value: product[field] });
    };

    const handleInlineEditChange = (e) => {
        setEditingCell({ ...editingCell, value: e.target.value });
    };

    const handleInlineEditCancel = () => {
        setEditingCell({ id: null, field: null, value: '' });
    };

    const handleInlineEditSave = async (product) => {
        if (String(editingCell.value) === String(product[editingCell.field])) {
            handleInlineEditCancel();
            return; // No change made
        }

        try {
            await updateProduct({
                productId: product._id,
                ...product, // Send existing data
                [editingCell.field]: Number(editingCell.value) || 0, // Update the specific field
            }).unwrap();

            refetch(); // Refresh list to get updated data
            handleInlineEditCancel();
        } catch (err) {
            CustomSwal.fire({ icon: 'error', title: 'Update Failed', text: err?.data?.message || err.error });
        }
    };

    const handleToggleDraft = async (product) => {
        try {
            await updateProduct({
                productId: product._id,
                ...product,
                isDraft: !product.isDraft,
            }).unwrap();
            refetch();
        } catch (err) {
            CustomSwal.fire({ icon: 'error', title: 'Update Failed', text: err?.data?.message || err.error });
        }
    };
    // -----------------------------

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
                            <th
                                className="p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none group transition-colors"
                                onClick={() => requestSort('name')}
                            >
                                Name {getSortIcon('name')}
                            </th>
                            <th
                                className="p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none group transition-colors"
                                onClick={() => requestSort('price')}
                            >
                                Price {getSortIcon('price')}
                            </th>
                            <th
                                className="p-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 select-none group transition-colors"
                                onClick={() => requestSort('countInStock')}
                            >
                                Stock {getSortIcon('countInStock')}
                            </th>
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
                                    <td className="p-4 font-medium text-gray-900">
                                        <div className="flex items-center space-x-2">
                                            <span>{product.name}</span>
                                            {product.isDraft && (
                                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Draft</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Inline Edit UI for Price */}
                                    <td className="p-4">
                                        {editingCell.id === product._id && editingCell.field === 'price' ? (
                                            <div className="flex items-center space-x-1">
                                                <span className="text-gray-500 text-sm">Rs.</span>
                                                <input
                                                    type="number"
                                                    className="w-20 border border-primary rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                    value={editingCell.value}
                                                    onChange={handleInlineEditChange}
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleInlineEditSave(product);
                                                        if (e.key === 'Escape') handleInlineEditCancel();
                                                    }}
                                                />
                                                <button onClick={() => handleInlineEditSave(product)} className="text-green-600 hover:text-green-800 p-1"><Check size={16} /></button>
                                                <button onClick={handleInlineEditCancel} className="text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <div className="group flex items-center space-x-2 cursor-pointer" onClick={() => handleInlineEditStart(product, 'price')}>
                                                <span>Rs. {product.price.toLocaleString()}</span>
                                                <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </td>

                                    {/* Inline Edit UI for Stock */}
                                    <td className="p-4">
                                        {product.variants && product.variants.length > 0 ? (
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProductStock(product) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} title="Stock is managed via the variant matrix">
                                                {getProductStock(product)} (Variants)
                                            </span>
                                        ) : editingCell.id === product._id && editingCell.field === 'countInStock' ? (
                                            <div className="flex items-center space-x-1">
                                                <input
                                                    type="number"
                                                    className="w-16 border border-primary rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                                                    value={editingCell.value}
                                                    onChange={handleInlineEditChange}
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleInlineEditSave(product);
                                                        if (e.key === 'Escape') handleInlineEditCancel();
                                                    }}
                                                />
                                                <button onClick={() => handleInlineEditSave(product)} className="text-green-600 hover:text-green-800 p-1"><Check size={16} /></button>
                                                <button onClick={handleInlineEditCancel} className="text-red-500 hover:text-red-700 p-1"><X size={16} /></button>
                                            </div>
                                        ) : (
                                            <div className="group flex items-center space-x-2 cursor-pointer" onClick={() => handleInlineEditStart(product, 'countInStock')}>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getProductStock(product) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {getProductStock(product)}
                                                </span>
                                                <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
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
                                    <td className="p-4 text-right space-x-2 flex items-center justify-end">
                                        <button
                                            onClick={() => handleToggleDraft(product)}
                                            className={`p-2 rounded-lg transition ${product.isDraft ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                                            title={product.isDraft ? 'Currently Draft. Click to Publish.' : 'Currently Published. Click to Unpublish.'}
                                        >
                                            {product.isDraft ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <Link
                                            to={`/admin/product/${product._id}/edit`}
                                            className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg text-sm font-semibold transition inline-block">
                                            <Edit2 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            disabled={isDeleting}
                                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg text-sm font-semibold transition">
                                            <Trash2 className="w-4 h-4" />
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
