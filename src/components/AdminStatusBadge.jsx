import React from 'react';

const STATUS_BASE = 'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide border shadow-sm';

const STATUS_COLORS = {
  Pending: 'bg-amber-200 text-amber-950 border-amber-300',
  Processing: 'bg-sky-200 text-sky-950 border-sky-300',
  Packed: 'bg-violet-200 text-violet-950 border-violet-300',
  Shipped: 'bg-indigo-200 text-indigo-950 border-indigo-300',
  'Out for Delivery': 'bg-orange-200 text-orange-950 border-orange-300',
  Delivered: 'bg-emerald-200 text-emerald-950 border-emerald-300',
  Cancelled: 'bg-rose-200 text-rose-950 border-rose-300',
  Refunded: 'bg-slate-200 text-slate-900 border-slate-300',
};

const AdminStatusBadge = ({ status, className = '' }) => (
  <span className={`${STATUS_BASE} ${STATUS_COLORS[status] || 'bg-slate-200 text-slate-900 border-slate-300'} ${className}`}>
    {status}
  </span>
);

export default AdminStatusBadge;
