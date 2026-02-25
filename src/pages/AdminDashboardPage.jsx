// src/pages/AdminDashboardPage.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetAnalyticsQuery } from '../slices/ordersApiSlice';
import {
    ShoppingBag, DollarSign, Clock, TrendingUp,
    Loader, AlertCircle, Package, Eye
} from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className={`bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 border-l-4 ${color}`}>
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

// Simple pure CSS bar chart — no external library needed
const BarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-400 py-8">No revenue data yet.</p>;
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

    return (
        <div className="flex items-end gap-2 h-48 pt-4">
            {data.map((item, i) => {
                const heightPercent = (item.revenue / maxRevenue) * 100;
                const label = `${MONTH_NAMES[item._id.month - 1]} '${String(item._id.year).slice(-2)}`;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500 font-semibold">
                            {item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}K` : item.revenue}
                        </span>
                        <div className="w-full flex items-end" style={{ height: '140px' }}>
                            <div
                                className="w-full bg-amber-500 hover:bg-amber-600 rounded-t transition-all duration-500"
                                style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                title={`Rs. ${item.revenue.toLocaleString()} — ${item.orders} orders`}
                            />
                        </div>
                        <span className="text-xs text-gray-400 text-center leading-tight">{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Processing: 'bg-blue-100 text-blue-700',
        Delivered: 'bg-green-100 text-green-700',
        Cancelled: 'bg-red-100 text-red-700',
    };
    return (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
};

const AdminDashboardPage = () => {
    const { data: analytics, isLoading, error } = useGetAnalyticsQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader className="w-8 h-8 animate-spin text-amber-700" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-5xl px-4 py-16 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-3" />
                <p className="text-gray-600">{error?.data?.message || 'Failed to load analytics.'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back! Here's your store overview.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/admin/products" className="text-sm text-amber-700 hover:underline font-medium">Products</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/admin/orders" className="text-sm text-amber-700 hover:underline font-medium">Orders</Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`Rs. ${analytics.totalRevenue?.toLocaleString()}`}
                        subtitle="From paid orders"
                        icon={DollarSign}
                        color="border-green-600"
                    />
                    <StatCard
                        title="Total Orders"
                        value={analytics.totalOrders}
                        subtitle={`${analytics.deliveredOrders} delivered`}
                        icon={ShoppingBag}
                        color="border-blue-600"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={analytics.pendingOrders}
                        subtitle="Awaiting processing"
                        icon={Clock}
                        color="border-yellow-500"
                    />
                    <StatCard
                        title="Processing"
                        value={analytics.processingOrders}
                        subtitle="In progress"
                        icon={TrendingUp}
                        color="border-amber-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-bold text-gray-900 mb-1">Revenue (Last 6 Months)</h2>
                        <p className="text-xs text-gray-400 mb-4">Paid orders only</p>
                        <BarChart data={analytics.monthlyRevenue} />
                    </div>

                    {/* Order Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-bold text-gray-900 mb-4">Order Breakdown</h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Delivered', value: analytics.deliveredOrders, color: 'bg-green-500' },
                                { label: 'Processing', value: analytics.processingOrders, color: 'bg-blue-500' },
                                { label: 'Pending', value: analytics.pendingOrders, color: 'bg-yellow-400' },
                                { label: 'Cancelled', value: analytics.cancelledOrders, color: 'bg-red-400' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                        <span>{item.label}</span>
                                        <span className="font-semibold">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: analytics.totalOrders > 0 ? `${(item.value / analytics.totalOrders) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-sm text-amber-700 hover:underline">View All →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Order</th>
                                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Customer</th>
                                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Total</th>
                                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Status</th>
                                    <th className="text-left py-2 text-xs font-semibold text-gray-400 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {analytics.recentOrders?.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="py-2.5 font-mono font-bold text-gray-700">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="py-2.5 text-gray-600">{order.user?.name || 'Guest'}</td>
                                        <td className="py-2.5 font-semibold text-gray-900">Rs. {order.totalPrice?.toLocaleString()}</td>
                                        <td className="py-2.5"><StatusBadge status={order.status} /></td>
                                        <td className="py-2.5">
                                            <Link to={`/admin/orders/${order._id}`} className="text-amber-700 hover:text-amber-800">
                                                <Eye className="w-4 h-4" />
                                            </Link>
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

export default AdminDashboardPage;
