// src/components/AdminCouponManager.jsx
import React, { useState } from 'react';
import {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
} from '../slices/couponApiSlice';
import { Plus, Trash2, Edit2, X, CheckCircle, AlertCircle, Tag } from 'lucide-react';

const AdminCouponManager = () => {
    const { data: coupons = [], isLoading } = useGetAllCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon] = useUpdateCouponMutation();
    const [deleteCoupon] = useDeleteCouponMutation();

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        code: '', description: '', discountType: 'percentage',
        discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true,
    });

    const resetForm = () => {
        setForm({ code: '', description: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', isActive: true });
        setEditId(null);
        setShowForm(false);
        setMsg('');
        setError('');
    };

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        try {
            if (editId) {
                await updateCoupon({ id: editId, ...form }).unwrap();
                setMsg('Coupon updated!');
            } else {
                await createCoupon(form).unwrap();
                setMsg('Coupon created!');
            }
            resetForm();
        } catch (err) {
            setError(err?.data?.message || 'Failed to save coupon.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this coupon?')) {
            try {
                await deleteCoupon(id).unwrap();
            } catch (err) {
                setError('Failed to delete.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-5xl px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Coupon Manager</h1>
                        <p className="text-sm text-gray-500">{coupons.length} active coupons</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="flex items-center gap-2 bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-800 transition text-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Coupon
                    </button>
                </div>

                {msg && <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 mb-4 text-sm"><CheckCircle className="w-4 h-4" />{msg}</div>}
                {error && <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

                {/* Coupon Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-amber-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-900">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>
                            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Code *</label>
                                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SUMMER20" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Summer Sale 20% off" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Type *</label>
                                <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (Rs.)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Discount Value *</label>
                                <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder={form.discountType === 'percentage' ? "e.g. 20" : "e.g. 500"} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" required min={0} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min Order (Rs.)</label>
                                <input type="number" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="0" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" min={0} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Max Uses</label>
                                <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="Leave blank for unlimited" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" min={1} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry Date</label>
                                <input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div className="flex items-center gap-2 mt-6">
                                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-amber-600" />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                            </div>
                            <div className="sm:col-span-2 flex gap-3">
                                <button type="submit" disabled={isCreating} className="bg-amber-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-800 transition text-sm disabled:opacity-50">
                                    {isCreating ? 'Saving...' : (editId ? 'Save Changes' : 'Create Coupon')}
                                </button>
                                <button type="button" onClick={resetForm} className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-50 transition text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Coupons Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
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
                                {isLoading && (
                                    <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading...</td></tr>
                                )}
                                {!isLoading && coupons.length === 0 && (
                                    <tr><td colSpan="7" className="text-center py-8 text-gray-400">No coupons yet. Create one!</td></tr>
                                )}
                                {coupons.map(coupon => (
                                    <tr key={coupon._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-amber-600" />
                                                <span className="font-mono font-bold text-gray-800">{coupon.code}</span>
                                            </div>
                                            {coupon.description && <p className="text-xs text-gray-400 mt-0.5">{coupon.description}</p>}
                                        </td>
                                        <td className="px-5 py-3 font-semibold text-green-700">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Rs. ${coupon.discountValue.toLocaleString()}`}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.minOrderAmount > 0 ? `Rs. ${coupon.minOrderAmount.toLocaleString()}` : '—'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.usedCount}/{coupon.maxUses ?? '∞'}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            {coupon.isActive
                                                ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Active</span>
                                                : <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">Inactive</span>
                                            }
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(coupon)} className="text-amber-600 hover:text-amber-800 transition"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(coupon._id)} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCouponManager;
