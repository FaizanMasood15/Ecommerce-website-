import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../slices/productsApiSlice';

const AdminProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setImage(res.image);
            alert(res.message);
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                price,
                image,
                category,
                countInStock,
                description,
            }).unwrap();
            alert('Product updated successfully');
            navigate('/admin/products');
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    if (isLoading) return <div className="text-center py-20 text-2xl font-bold">Loading product details...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">Error loading product</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/admin/products')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-6 transition"
            >
                Back to Products
            </button>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Product</h1>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Price (Rs)</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Image URL or Upload</label>
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                        />
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-amber-700 transition"
                        />
                        {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Category</label>
                        <input
                            type="text"
                            placeholder="Enter category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Count In Stock</label>
                        <input
                            type="number"
                            placeholder="Enter stock amount"
                            value={countInStock}
                            onChange={(e) => setCountInStock(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea
                            rows="4"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-primary hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                    >
                        {isUpdating ? 'Saving...' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProductEditPage;
