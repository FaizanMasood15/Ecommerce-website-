import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../slices/productsApiSlice';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

const AdminProductEditPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

    useEffect(() => {
        if (product) {
            if (product.name === 'Sample name') {
                // It's a brand new dummy product, clear fields for the user
                setName('');
                setSku('');
                setPrice('');
                setImages([]);
                setColors([]);
                setSizes([]);
                setCategory('');
                setCountInStock('');
                setDescription('');
            } else {
                setName(product.name);
                setSku(product.sku || '');
                setPrice(product.price);

                // Handle backwards compatibility where older DB models only had 'image' string
                const allImages = [product.image, ...(product.images || [])].filter(Boolean);
                const uniqueImages = [...new Set(allImages)]; // Remove accidental duplicates
                setImages(uniqueImages);

                setColors(product.colors || []);
                setSizes(product.sizes || []);
                setVariants(product.variants || []);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
    }, [product]);

    // Automatically generate or sync the variants matrix when sizes/colors change
    useEffect(() => {
        if (!sizes.length && !colors.length) {
            setVariants([]);
            return;
        }

        const newVariants = [];

        // If sizes exist but no colors
        if (sizes.length > 0 && colors.length === 0) {
            sizes.forEach(size => {
                const existing = variants.find(v => v.size === size && !v.color);
                newVariants.push(existing || { size, color: '', colorHex: '', price: price, countInStock: 0, sku: '' });
            });
        }
        // If colors exist but no sizes
        else if (colors.length > 0 && sizes.length === 0) {
            colors.forEach(color => {
                const existing = variants.find(v => v.color === color.name && !v.size);
                newVariants.push(existing || { size: '', color: color.name, colorHex: color.hex, price: price, countInStock: 0, sku: '' });
            });
        }
        // Both exist
        else {
            sizes.forEach(size => {
                colors.forEach(color => {
                    const existing = variants.find(v => v.size === size && v.color === color.name);
                    newVariants.push(existing || {
                        size,
                        color: color.name,
                        colorHex: color.hex,
                        price: price,
                        countInStock: 0,
                        sku: ''
                    });
                });
            });
        }

        // Only update if the length changed or the core permutations changed, to avoid infinite loops
        if (JSON.stringify(newVariants.map(v => `${v.size}-${v.color}`)) !== JSON.stringify(variants.map(v => `${v.size}-${v.color}`))) {
            setVariants(newVariants);
        }
    }, [sizes, colors]);

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setVariants(updatedVariants);
    };

    const uploadFileHandler = async (e) => {
        if (images.length >= 5) {
            alert('Maximum of 5 images allowed');
            return;
        }

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await uploadProductImage(formData).unwrap();
            setImages(prev => [...prev, res.image]);
            // Clear the file input so they can upload another easily if desired
            e.target.value = null;
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleAddSize = () => {
        if (newSize.trim() && !sizes.includes(newSize.trim().toUpperCase())) {
            setSizes([...sizes, newSize.trim().toUpperCase()]);
            setNewSize('');
        }
    };

    const handleRemoveSize = (sizeToRemove) => {
        setSizes(sizes.filter(size => size !== sizeToRemove));
    };

    const handleAddColor = () => {
        if (newColorName.trim()) {
            setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
            setNewColorName('');
            setNewColorHex('#000000');
        }
    };

    const handleRemoveColor = (indexToRemove) => {
        setColors(colors.filter((_, index) => index !== indexToRemove));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await updateProduct({
                productId,
                name,
                sku,
                price: Number(price) || 0,
                image: images[0] || '/images/sample.jpg', // Backward compatibility for legacy UI
                images, // New array
                colors,
                sizes,
                variants,
                category,
                countInStock: Number(countInStock) || 0,
                description,
            }).unwrap();

            CustomSwal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product saved successfully.',
            }).then(() => {
                navigate('/admin/products');
            });
        } catch (err) {
            CustomSwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err?.data?.message || err.error,
            });
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
                        <label className="block text-gray-700 font-semibold mb-2">SKU / ID</label>
                        <input
                            type="text"
                            placeholder="Enter custom SKU or ID"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
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
                        <label className="block text-gray-700 font-semibold mb-2">Product Images ({images.length}/5)</label>

                        {/* Image Previews */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-5 gap-4 mb-4">
                                {images.map((imgUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={imgUrl}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                        {index === 0 && <span className="absolute bottom-0 left-0 bg-primary text-white text-[10px] px-1 rounded-tr-md rounded-bl-md">Main</span>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {images.length < 5 && (
                            <input
                                type="file"
                                onChange={uploadFileHandler}
                                disabled={isUploading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-amber-700 transition"
                            />
                        )}
                        {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading image...</p>}
                        <p className="text-xs text-gray-400 mt-1">Upload up to 5 images. The first image will be used as the main thumbnail.</p>
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

                    <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                        <label className="block text-gray-700 font-semibold mb-3">Available Sizes</label>
                        <div className="flex flex-wrap gap-3">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                                const isSelected = sizes.includes(size);
                                return (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSizes(sizes.filter(s => s !== size));
                                            } else {
                                                setSizes([...sizes, size]);
                                            }
                                        }}
                                        className={`w-12 h-12 rounded-lg font-semibold flex items-center justify-center transition-all ${isSelected
                                            ? 'bg-primary text-white shadow-md border-transparent'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                        <label className="block text-gray-700 font-semibold mb-3">Available Colors</label>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { name: 'Black', hex: '#000000' },
                                { name: 'White', hex: '#ffffff' },
                                { name: 'Red', hex: '#ef4444' },
                                { name: 'Blue', hex: '#3b82f6' },
                                { name: 'Green', hex: '#22c55e' },
                                { name: 'Yellow', hex: '#eab308' },
                                { name: 'Brown', hex: '#8B4513' },
                                { name: 'Tan', hex: '#D2B48C' },
                                { name: 'Gray', hex: '#6b7280' }
                            ].map((color) => {
                                const isSelected = colors.some(c => c.name === color.name);
                                return (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setColors(colors.filter(c => c.name !== color.name));
                                            } else {
                                                setColors([...colors, color]);
                                            }
                                        }}
                                        className={`flex flex-col items-center space-y-1 p-2 rounded-lg border transition-all ${isSelected
                                            ? 'bg-blue-50 border-primary shadow-sm'
                                            : 'bg-white border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <span
                                            className="w-8 h-8 rounded-full border shadow-sm flex items-center justify-center"
                                            style={{ backgroundColor: color.hex, borderColor: color.hex === '#ffffff' ? '#e5e7eb' : color.hex }}
                                        >
                                            {isSelected && <span className={color.hex === '#ffffff' ? 'text-black' : 'text-white'}>✓</span>}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'font-semibold text-primary' : 'text-gray-600'}`}>{color.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Variant Matrix */}
                    {variants.length > 0 && (
                        <div className="border border-primary/20 p-4 rounded-lg bg-white shadow-sm overflow-x-auto">
                            <h3 className="text-gray-900 font-bold mb-4 flex items-center">
                                <span className="bg-primary text-white w-6 h-6 rounded-full inline-flex justify-center items-center text-xs mr-2 border border-amber-700">✓</span>
                                Variant Pricing & Stock Inventory
                            </h3>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                        <th className="p-3 font-semibold">Variant (Size / Color)</th>
                                        <th className="p-3 font-semibold w-24">Price (Rs)</th>
                                        <th className="p-3 font-semibold w-24">Stock</th>
                                        <th className="p-3 font-semibold">SKU (Optional)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variants.map((variant, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="p-3">
                                                <div className="flex items-center space-x-2">
                                                    {variant.colorHex && (
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                                                            style={{ backgroundColor: variant.colorHex }}
                                                            title={variant.color}
                                                        ></span>
                                                    )}
                                                    <span className="font-medium text-gray-800">
                                                        {variant.size || 'Default'} {variant.color && `- ${variant.color}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="number"
                                                    value={variant.countInStock}
                                                    onChange={(e) => handleVariantChange(index, 'countInStock', Number(e.target.value))}
                                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={variant.sku || ''}
                                                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                    placeholder="e.g. SHIRT-M-RED"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-3 flex items-center">
                                <span className="mr-1">ℹ️</span>
                                If a variant has 0 stock, it will show as "Out of Stock" when a user selects that combination.
                            </p>
                        </div>
                    )}

                    <div className="pb-10">
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <div className="bg-white">
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={setDescription}
                                className="h-48 rounded-lg"
                                placeholder="Write a detailed description here..."
                            />
                        </div>
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
