// src/pages/AdminCategoryManager.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from '../slices/categoriesApiSlice';
import { Plus, Trash2, Edit2, X, Layers, Eye, EyeOff, GripVertical, FolderOpen, ChevronRight } from 'lucide-react';

// Shared SweetAlert2 mixin (same style as AdminProductListPage)
const CustomSwal = Swal.mixin({
    customClass: {
        confirmButton: 'bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg ml-3 transition duration-200',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200',
        popup: 'bg-white rounded-2xl shadow-xl border border-gray-100 p-6',
        title: 'text-xl font-bold text-gray-900',
        htmlContainer: 'text-gray-600 font-medium',
    },
    buttonsStyling: false,
});

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: { popup: 'rounded-xl shadow-lg' },
});

const EMPTY_FORM = {
    name: '', description: '', image: '', icon: '',
    parent: '', order: 0, isActive: true, showInNav: true,
};

const AdminCategoryManager = () => {
    const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const topLevel = categories.filter(c => !c.parent);
    const getChildren = (parentId) =>
        categories.filter(c => c.parent?._id === parentId || c.parent === parentId);

    const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setForm({
            name: cat.name,
            description: cat.description || '',
            image: cat.image || '',
            icon: cat.icon || '',
            parent: cat.parent?._id || cat.parent || '',
            order: cat.order ?? 0,
            isActive: cat.isActive,
            showInNav: cat.showInNav,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, parent: form.parent || null };
        try {
            if (editId) {
                await updateCategory({ id: editId, ...payload }).unwrap();
                Toast.fire({ icon: 'success', title: 'Category updated!' });
            } else {
                await createCategory(payload).unwrap();
                Toast.fire({ icon: 'success', title: `"${form.name}" category created!` });
            }
            resetForm();
        } catch (err) {
            CustomSwal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: err?.data?.message || 'Could not save category. Please try again.',
            });
        }
    };

    const handleDelete = async (cat) => {
        const children = getChildren(cat._id);
        const childText = children.length > 0
            ? `<br/><span class="text-xs text-gray-700 font-medium">Warning: ${children.length} subcategory(ies) will be promoted to top level.</span>`
            : '';

        const result = await CustomSwal.fire({
            title: 'Delete Category?',
            html: `You are about to permanently delete <strong>"${cat.name}"</strong>.${childText}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete It',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(cat._id).unwrap();
                Toast.fire({ icon: 'success', title: `"${cat.name}" deleted` });
            } catch (err) {
                CustomSwal.fire({ icon: 'error', title: 'Delete Failed', text: err?.data?.message || 'Something went wrong.' });
            }
        }
    };

    const handleToggleNav = async (cat) => {
        try {
            await updateCategory({ id: cat._id, showInNav: !cat.showInNav }).unwrap();
            Toast.fire({
                icon: 'info',
                title: cat.showInNav ? `"${cat.name}" hidden from nav` : `"${cat.name}" visible in nav`,
            });
        } catch { /* silent */ }
    };

    const handleToggleActive = async (cat) => {
        try {
            await updateCategory({ id: cat._id, isActive: !cat.isActive }).unwrap();
            Toast.fire({ icon: 'info', title: cat.isActive ? `"${cat.name}" deactivated` : `"${cat.name}" activated` });
        } catch { /* silent */ }
    };

    return (
        <div className="max-w-5xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-6 h-6 text-gray-900" /> Navigation Categories
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">Categories and subcategories shown in the site header</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-sm shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700 transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Living Room" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Parent Category</label>
                                <select value={form.parent} onChange={e => setForm(f => ({ ...f, parent: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                                    <option value="">None (Top-level)</option>
                                    {categories.filter(c => !c.parent && c._id !== editId).map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
                                <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" min={0} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL <span className="text-gray-400 font-normal">(optional, for mega-menu)</span></label>
                                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description <span className="text-gray-400 font-normal">(shown in dropdown)</span></label>
                                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-gray-900" />
                                    <span className="font-medium text-gray-700">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={form.showInNav} onChange={e => setForm(f => ({ ...f, showInNav: e.target.checked }))} className="w-4 h-4 accent-gray-900" />
                                    <span className="font-medium text-gray-700">Show in Nav</span>
                                </label>
                            </div>
                            <div className="sm:col-span-2 flex gap-3">
                                <button type="submit" disabled={isCreating} className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-sm disabled:opacity-50">
                                    {isCreating ? 'Saving...' : (editId ? 'Save Changes' : 'Create Category')}
                                </button>
                                <button type="button" onClick={resetForm} className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Category Tree */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {isLoading && <div className="text-center py-10 text-gray-400">Loading categories...</div>}
                    {!isLoading && categories.length === 0 && (
                        <div className="text-center py-16">
                            <FolderOpen className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                            <p className="text-gray-400 font-medium">No categories yet</p>
                            <p className="text-gray-400 text-sm mt-1">Create your first category to display it in the navigation</p>
                        </div>
                    )}
                    {topLevel.map(cat => {
                        const children = getChildren(cat._id);
                        return (
                            <div key={cat._id} className="border-b last:border-0">
                                {/* Parent row */}
                                <div className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition ${!cat.isActive ? 'opacity-45' : ''}`}>
                                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                                        {cat.description && <p className="text-xs text-gray-400 truncate">{cat.description}</p>}
                                        {children.length > 0 && (
                                            <p className="text-xs text-gray-700 mt-0.5">{children.length} subcategor{children.length > 1 ? 'ies' : 'y'}</p>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-300 hidden sm:block w-8 text-right">#{cat.order}</span>
                                    <button onClick={() => handleToggleNav(cat)} title={cat.showInNav ? 'Visible in nav - click to hide' : 'Hidden from nav - click to show'} className={`p-1.5 rounded-full transition ${cat.showInNav ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                                        {cat.showInNav ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleEdit(cat)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(cat)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                {/* Child rows */}
                                {children.map(child => (
                                    <div key={child._id} className={`flex items-center gap-3 px-5 py-2.5 bg-stone-50/60 border-t border-gray-50 hover:bg-gray-100 transition ${!child.isActive ? 'opacity-45' : ''}`}>
                                        <div className="w-4 flex-shrink-0" />
                                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm text-gray-700">{child.name}</p>
                                            {child.description && <p className="text-xs text-gray-400 truncate">{child.description}</p>}
                                        </div>
                                        <span className="text-xs text-gray-300 hidden sm:block w-8 text-right">#{child.order}</span>
                                        <button onClick={() => handleToggleNav(child)} className={`p-1.5 rounded-full transition ${child.showInNav ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                                            {child.showInNav ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => handleEdit(child)} className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(child)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-5 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-green-500" /> Visible in nav</span>
                    <span className="flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /> Hidden from nav</span>
                    <span>Order # = left-to-right position</span>
                </div>
        </div>
    );
};

export default AdminCategoryManager;


