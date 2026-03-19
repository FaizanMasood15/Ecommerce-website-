// src/pages/AdminCouponManager.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from '../slices/couponApiSlice';
import { Plus, Trash2, Edit2, X, Tag } from 'lucide-react';

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
    code: '', description: '', discountType: 'percentage',
    discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true,
};

const AdminCouponManager = () => {
    const { data: coupons = [], isLoading } = useGetAllCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);

    const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

    const handleEdit = (coupon) => {
        setEditId(coupon._id);
        setForm({
            code: coupon.code,
            description: coupon.description || '',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || '',
            maxUses: coupon.maxUses || '',
            expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
            isActive: coupon.isActive,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateCoupon({ id: editId, ...form }).unwrap();
                Toast.fire({ icon: 'success', title: `Coupon "${form.code}" updated!` });
            } else {
                await createCoupon(form).unwrap();
                Toast.fire({ icon: 'success', title: `Coupon "${form.code}" created!` });
            }
            resetForm();
        } catch (err) {
            CustomSwal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: err?.data?.message || 'Could not save coupon. Please try again.',
            });
        }
    };

    const handleDelete = async (coupon) => {
        const result = await CustomSwal.fire({
            title: 'Delete Coupon?',
            html: `You are about to permanently delete the coupon <strong class="font-mono">${coupon.code}</strong>.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete It',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await deleteCoupon(coupon._id).unwrap();
                Toast.fire({ icon: 'success', title: `Coupon "${coupon.code}" deleted` });
            } catch (err) {
                CustomSwal.fire({ icon: 'error', title: 'Delete Failed', text: err?.data?.message || 'Something went wrong.' });
            }
        }
    };

    return (
        <div className="max-w-5xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Coupon Manager</h1>
                        <p className="text-sm text-gray-500">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-sm shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Coupon
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900 text-lg">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700 transition"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Code *</label>
                                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 uppercase font-mono" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Summer Sale 20% off" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type *</label>
                                <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (USD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Value *</label>
                                <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder={form.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required min={0} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order (USD)</label>
                                <input type="number" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" min={0} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Uses <span className="text-gray-400 font-normal">(blank = unlimited)</span></label>
                                <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Unlimited" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" min={1} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input type="checkbox" id="couponIsActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-gray-900" />
                                <label htmlFor="couponIsActive" className="text-sm font-medium text-gray-700 cursor-pointer">Active</label>
                            </div>
                            <div className="sm:col-span-2 flex gap-3">
                                <button type="submit" disabled={isCreating} className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-sm disabled:opacity-50">
                                    {isCreating ? 'Saving...' : (editId ? 'Save Changes' : 'Create Coupon')}
                                </button>
                                <button type="button" onClick={resetForm} className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-5 py-3 text-left">Code</th>
                                    <th className="px-5 py-3 text-left">Discount</th>
                                    <th className="px-5 py-3 text-left">Min Order</th>
                                    <th className="px-5 py-3 text-left">Uses</th>
                                    <th className="px-5 py-3 text-left">Expires</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading && <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>}
                                {!isLoading && coupons.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-10 text-gray-400">No coupons yet. Create one above!</td></tr>
                                )}
                                {coupons.map(coupon => (
                                    <tr key={coupon._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-gray-700 flex-shrink-0" />
                                                <span className="font-mono font-bold text-gray-800">{coupon.code}</span>
                                            </div>
                                            {coupon.description && <p className="text-xs text-gray-400 mt-0.5 ml-6">{coupon.description}</p>}
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-green-700">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue?.toLocaleString()}`}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount?.toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.usedCount}/{coupon.maxUses ?? 'Unlimited'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                        </td>
                                        <td className="px-5 py-3">
                                            {coupon.isActive
                                                ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                                                : <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">Inactive</span>
                                            }
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-3">
                                                <button onClick={() => handleEdit(coupon)} title="Edit" className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded-full transition"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(coupon)} title="Delete" className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
};

export default AdminCouponManager;



