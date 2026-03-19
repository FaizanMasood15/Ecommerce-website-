// src/pages/AdminOrderListPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllOrdersQuery } from '../slices/ordersApiSlice';
import { Loader, Eye, AlertCircle } from 'lucide-react';
import AdminStatusBadge from '../components/AdminStatusBadge';

const AdminOrderListPage = () => {
    const { data: orders, isLoading, error } = useGetAllOrdersQuery();
    const [statusFilter, setStatusFilter] = useState('All');

    const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];

    const filteredOrders = statusFilter === 'All'
        ? orders
        : orders?.filter(o => o.status === statusFilter);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-gray-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl px-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-3" />
                <p className="text-gray-600">{error?.data?.message || 'Failed to load orders.'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
                        <p className="text-sm text-gray-500">{orders?.length || 0} total orders</p>
                    </div>
                    <Link to="/admin/products" className="text-gray-900 hover:underline text-sm">Back to Products</Link>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {ALL_STATUSES.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${statusFilter === status
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                                }`}
                        >
                            {status}
                            {status !== 'All' && (
                                <span className="ml-1 text-xs opacity-70">
                                    ({orders?.filter(o => o.status === status).length || 0})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Paid</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders && filteredOrders.length > 0 ? filteredOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 font-mono text-gray-800 font-semibold">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3">
                                            {order.user ? (
                                                <>
                                                    <p className="font-medium text-gray-900">{order.user.name}</p>
                                                    <p className="text-xs text-gray-500">{order.user.email}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-500 italic">Guest</p>
                                                    {order.guestEmail && <p className="text-xs text-gray-400">{order.guestEmail}</p>}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-gray-900">
                                            ${order.totalPrice?.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3">
                                            {order.isPaid
                                                ? <span className="text-green-600 font-semibold">Paid</span>
                                                : <span className="text-red-500">Unpaid</span>
                                            }
                                        </td>
                                        <td className="px-5 py-3">
                                            <AdminStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-5 py-3">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-1 text-gray-800 hover:text-black font-medium"
                                            >
                                                <Eye className="w-4 h-4" /> View
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-500 py-12">
                                            No orders found{statusFilter !== 'All' ? ` with status "${statusFilter}"` : ''}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
};

export default AdminOrderListPage;


