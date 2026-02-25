// src/pages/AdminOrderDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    useGetOrderDetailsQuery,
    useUpdateOrderStatusMutation,
    useMarkOrderAsPaidMutation,
    useMarkOrderAsDeliveredMutation,
} from '../slices/ordersApiSlice';
import { Loader, AlertCircle, Package } from 'lucide-react';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: { popup: 'rounded-xl shadow-lg' },
});

const CustomSwal = Swal.mixin({
    customClass: {
        confirmButton: 'bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-6 rounded-lg ml-3 transition',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition',
        popup: 'bg-white rounded-2xl shadow-xl border border-gray-100 p-6',
        title: 'text-xl font-bold text-gray-900',
    },
    buttonsStyling: false,
});

const STATUS_OPTIONS = ['Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Processing: 'bg-blue-100 text-blue-800',
        Packed: 'bg-purple-100 text-purple-800',
        Shipped: 'bg-indigo-100 text-indigo-800',
        'Out for Delivery': 'bg-orange-100 text-orange-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
        Refunded: 'bg-gray-100 text-gray-700',
    };
    return (
        <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${colors[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};

const AdminOrderDetailPage = () => {
    const { id } = useParams();
    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(id);
    const [updateOrderStatus, { isLoading: isStatusLoading }] = useUpdateOrderStatusMutation();
    const [markOrderAsPaid, { isLoading: isPaidLoading }] = useMarkOrderAsPaidMutation();
    const [markOrderAsDelivered, { isLoading: isDeliverLoading }] = useMarkOrderAsDeliveredMutation();

    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusNote, setStatusNote] = useState('');

    const handleStatusUpdate = async () => {
        if (!selectedStatus) return;
        try {
            await updateOrderStatus({ id, status: selectedStatus, note: statusNote }).unwrap();
            Toast.fire({ icon: 'success', title: `Status updated to "${selectedStatus}"` });
            setSelectedStatus('');
            setStatusNote('');
            refetch();
        } catch (err) {
            CustomSwal.fire({ icon: 'error', title: 'Update Failed', text: err?.data?.message || 'Could not update status.' });
        }
    };

    const handleMarkPaid = async () => {
        try {
            await markOrderAsPaid({ id, paymentResult: { id: 'MANUAL', status: 'COMPLETED', update_time: new Date().toISOString() } }).unwrap();
            Toast.fire({ icon: 'success', title: 'Order marked as paid' });
            refetch();
        } catch {
            CustomSwal.fire({ icon: 'error', title: 'Failed', text: 'Could not mark order as paid.' });
        }
    };

    const handleMarkDelivered = async () => {
        try {
            await markOrderAsDelivered(id).unwrap();
            Toast.fire({ icon: 'success', title: 'Order marked as delivered' });
            refetch();
        } catch {
            CustomSwal.fire({ icon: 'error', title: 'Failed', text: 'Could not mark order as delivered.' });
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader className="w-8 h-8 animate-spin text-amber-700" /></div>;
    if (error) return <div className="text-center py-16"><AlertCircle className="mx-auto w-10 h-10 text-red-400 mb-3" /><p>{error?.data?.message || 'Order not found'}</p></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-5xl px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link to="/admin/orders" className="text-amber-700 text-sm hover:underline">← All Orders</Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            Order #{order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-5">
                        {/* Customer & Shipping */}
                        <div className="bg-white rounded-xl shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h2 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide text-gray-500">Customer</h2>
                                {order.user ? (
                                    <>
                                        <p className="font-semibold text-gray-900">{order.user?.name}</p>
                                        <p className="text-sm text-gray-500">{order.user?.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold text-gray-500 italic">Guest Order</p>
                                        {order.guestEmail && <p className="text-sm text-gray-500">{order.guestEmail}</p>}
                                    </>
                                )}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide text-gray-500">Ship To</h2>
                                <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                                <p className="text-sm text-gray-500">{order.shippingAddress.address}</p>
                                <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                                {order.shippingAddress.phone && <p className="text-sm text-gray-500">📞 {order.shippingAddress.phone}</p>}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-4">Items ({order.orderItems.length})</h2>
                            <div className="space-y-3">
                                {order.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                                {item.selectedSize && item.selectedColor && ' · '}
                                                {item.selectedColor && `Color: ${item.selectedColor}`}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">{item.qty} × Rs. {item.price?.toLocaleString()}</p>
                                        <p className="font-bold text-gray-900 text-sm w-24 text-right">Rs. {(item.qty * item.price)?.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status History */}
                        {order.statusHistory?.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <h2 className="font-bold text-gray-900 mb-3">Status History</h2>
                                <div className="space-y-2">
                                    {[...order.statusHistory].reverse().map((entry, i) => (
                                        <div key={i} className="flex gap-3 items-start text-sm">
                                            <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-semibold text-gray-800">{entry.status}</span>
                                                {entry.note && <span className="text-gray-500"> — {entry.note}</span>}
                                                <p className="text-xs text-gray-400">{new Date(entry.changedAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Controls */}
                    <div className="space-y-5">
                        {/* Price Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">Payment</h2>
                            <div className="space-y-1.5 text-sm text-gray-600">
                                <div className="flex justify-between"><span>Method</span><span className="font-medium text-gray-800">{order.paymentMethod}</span></div>
                                <div className="flex justify-between"><span>Subtotal</span><span>Rs. {order.itemsPrice?.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `Rs. ${order.shippingPrice}`}</span></div>
                                <hr />
                                <div className="flex justify-between font-bold text-gray-900"><span>Total</span><span>Rs. {order.totalPrice?.toLocaleString()}</span></div>
                            </div>
                            <div className={`mt-3 text-sm font-semibold ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                {order.isPaid ? `✓ Paid on ${new Date(order.paidAt).toLocaleDateString()}` : '⚠ Not paid yet'}
                            </div>

                            {!order.isPaid && (
                                <button
                                    onClick={handleMarkPaid}
                                    disabled={isPaidLoading}
                                    className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {isPaidLoading ? 'Processing...' : 'Mark as Paid'}
                                </button>
                            )}
                            {!order.isDelivered && order.status !== 'Cancelled' && (
                                <button
                                    onClick={handleMarkDelivered}
                                    disabled={isDeliverLoading}
                                    className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-50"
                                >
                                    {isDeliverLoading ? 'Processing...' : 'Mark as Delivered'}
                                </button>
                            )}
                        </div>

                        {/* Update Status */}
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">Update Status</h2>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
                            >
                                <option value="">-- Select new status --</option>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input
                                type="text"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                placeholder="Optional note (e.g. tracking number)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                            />
                            <button
                                onClick={handleStatusUpdate}
                                disabled={isStatusLoading || !selectedStatus}
                                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 text-sm"
                            >
                                {isStatusLoading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailPage;
