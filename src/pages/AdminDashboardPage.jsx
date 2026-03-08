// src/pages/AdminDashboardPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAnalyticsQuery } from '../slices/ordersApiSlice';
import {
    ShoppingBag, DollarSign, Clock, TrendingUp,
    Loader, AlertCircle, Eye, Tag, Ticket, Box
} from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtRevenue = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v;

const getLabel = (item, period) => {
    if (period === 'daily') {
        const d = new Date(item._id.year, item._id.month - 1, item._id.day);
        return `${item._id.day} ${MONTH_NAMES[item._id.month - 1]}`;
    }
    if (period === 'weekly') return item._id.weekLabel || `W${item._id.week}`;
    if (period === 'yearly') return `${item._id.year}`;
    return `${MONTH_NAMES[(item._id.month || 1) - 1]} '${String(item._id.year).slice(-2)}`;
};

// ── Components ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon: Icon, bg }) => (
    <div className="relative overflow-hidden rounded-2xl p-5 shadow-md" style={{ background: bg }}>
        {/* Watermark icon */}
        <Icon className="absolute -bottom-3 -right-3 w-20 h-20 text-white opacity-10" />
        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-white">{value}</p>
        {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
    </div>
);

const PERIODS = [
    { key: 'daily', label: 'Daily', sub: 'Last 30 days' },
    { key: 'weekly', label: 'Weekly', sub: 'Last 12 weeks' },
    { key: 'monthly', label: 'Monthly', sub: 'Last 12 months' },
    { key: 'yearly', label: 'Yearly', sub: 'Last 10 years' },
];

const BarChart = ({ data, period }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-400 py-10">No revenue data yet.</p>;
    }

    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxRevenue)));
    const yMax = Math.ceil(maxRevenue / magnitude) * magnitude;
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => Math.round(yMax * f));
    const CHART_HEIGHT = 190;

    // ── Professional label logic ───────────────────────────────────────────────
    // Daily  → show a dim "anchor" label every 7 days for timeline context,
    //          plus a highlighted amber label directly under any bar with revenue.
    // Others → every bar gets a label (≤12 items always fit).
    const showAnchor = (i) => period !== 'daily' || i === 0 || i % 7 === 0 || i === data.length - 1;
    const isRevenueDay = (i) => period === 'daily' && data[i].revenue > 0;

    return (
        <div className="flex gap-3">
            {/* Y-axis */}
            <div
                className="flex flex-col-reverse justify-between text-right pr-2 border-r border-gray-100 flex-shrink-0"
                style={{ height: CHART_HEIGHT + 24 }}
            >
                {gridLines.map((v, i) => (
                    <span key={i} className="text-xs text-gray-400 leading-none w-10">{fmtRevenue(v)}</span>
                ))}
            </div>

            {/* Chart body */}
            <div className="flex-1 min-w-0 relative">
                {/* Gridlines */}
                <div className="absolute inset-x-0" style={{ height: CHART_HEIGHT }}>
                    {gridLines.map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-full border-t border-dashed border-gray-100"
                            style={{ bottom: `${(i / (gridLines.length - 1)) * 100}%` }}
                        />
                    ))}
                </div>

                {/* Bars */}
                <div className="flex items-end gap-1" style={{ height: CHART_HEIGHT }}>
                    {data.map((item, i) => {
                        const pct = (item.revenue / yMax) * 100;
                        const empty = item.revenue === 0;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                                {/* Hover tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-lg">
                                    <p className="font-bold">${item.revenue.toLocaleString()}</p>
                                    <p className="text-gray-300">{item.orders} order{item.orders !== 1 ? 's' : ''}</p>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                                {/* Revenue value above bar */}
                                {!empty && (
                                    <span className="absolute text-xs font-bold text-amber-700" style={{ bottom: `calc(${pct}% + 6px)` }}>
                                        {fmtRevenue(item.revenue)}
                                    </span>
                                )}
                                {/* Bar */}
                                <div
                                    className={`w-full rounded-t-md cursor-pointer transition-all duration-700 ${empty
                                        ? 'bg-gray-100'
                                        : 'bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-700 hover:to-amber-500'
                                        }`}
                                    style={{ height: `${empty ? 1.5 : Math.max(pct, 2)}%` }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* X-axis labels */}
                <div className="flex gap-1 mt-2 border-t border-gray-100 pt-1.5">
                    {data.map((item, i) => (
                        <div key={i} className="flex-1 text-center overflow-hidden">
                            {isRevenueDay(i) ? (
                                // Revenue day → amber highlight so it visually "belongs" to the bar
                                <span className="text-[10px] font-semibold text-amber-600 leading-none">
                                    {getLabel(item, period)}
                                </span>
                            ) : showAnchor(i) ? (
                                // Week / period anchor → dim gray
                                <span className="text-xs text-gray-400 leading-none">
                                    {getLabel(item, period)}
                                </span>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
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

// ── Page ──────────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
    const [period, setPeriod] = useState('monthly');
    const { data: analytics, isLoading, error, isFetching } = useGetAnalyticsQuery(period);

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

    const currentPeriodMeta = PERIODS.find(p => p.key === period);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-7xl px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back! Here's your store overview.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/admin/products" className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium hover:underline transition">
                            <Box className="w-3.5 h-3.5" /> Products
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/admin/orders" className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium hover:underline transition">
                            <ShoppingBag className="w-3.5 h-3.5" /> Orders
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/admin/categories" className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium hover:underline transition">
                            <Tag className="w-3.5 h-3.5" /> Categories
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/admin/coupons" className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium hover:underline transition">
                            <Ticket className="w-3.5 h-3.5" /> Coupons
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Revenue"
                        value={`$${analytics.totalRevenue?.toLocaleString()}`}
                        subtitle="From delivered orders"
                        icon={DollarSign}
                        bg="linear-gradient(135deg, #4ade80, #22c55e)"
                    />
                    <StatCard
                        title="Total Orders"
                        value={analytics.totalOrders}
                        subtitle={`${analytics.deliveredOrders} delivered`}
                        icon={ShoppingBag}
                        bg="linear-gradient(135deg, #60a5fa, #3b82f6)"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={analytics.pendingOrders}
                        subtitle="Awaiting processing"
                        icon={Clock}
                        bg="linear-gradient(135deg, #fcd34d, #fbbf24)"
                    />
                    <StatCard
                        title="Processing"
                        value={analytics.processingOrders}
                        subtitle="In progress"
                        icon={TrendingUp}
                        bg="linear-gradient(135deg, #fb923c, #f97316)"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        {/* Chart header + period toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg">Revenue Overview</h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {currentPeriodMeta?.sub} · From delivered orders
                                </p>
                            </div>

                            {/* Period Toggle Pill */}
                            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 self-start sm:self-auto">
                                {PERIODS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setPeriod(key)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${period === key
                                            ? 'bg-white text-amber-700 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart */}
                        <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-40' : 'opacity-100'}`}>
                            {isFetching && !analytics ? (
                                <div className="flex items-center justify-center h-48">
                                    <Loader className="w-6 h-6 animate-spin text-amber-600" />
                                </div>
                            ) : (
                                <BarChart data={analytics?.chartData} period={period} />
                            )}
                        </div>
                    </div>

                    {/* Order Breakdown */}
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
                                        <td className="py-2.5 font-semibold text-gray-900">${order.totalPrice?.toLocaleString()}</td>
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

