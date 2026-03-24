import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Package, ShoppingBag, Tag, Ticket, Menu, X, LogOut, House } from 'lucide-react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)] min-h-screen">
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close sidebar overlay"
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-primary text-white transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}
        >
          <div className={`h-16 border-b border-white/10 flex items-center ${collapsed ? 'px-2 justify-center' : 'px-4 justify-between'}`}>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold tracking-wide">Funiro15</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Control Center</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed((v) => !v);
                } else {
                  setMobileOpen((v) => !v);
                }
              }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="hidden lg:inline"><Menu className="w-4 h-4" /></span>
              <span className="lg:hidden">{mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</span>
            </button>
          </div>

          <div className={`py-3 border-b border-white/10 flex items-center ${collapsed ? 'px-2 justify-center' : 'px-4'}`}>
            {!collapsed && <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/50">Navigation</p>}
          </div>
          <nav className={`p-2 w-[240px] ${collapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'}`}>
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
                title={collapsed ? label : undefined}
              >
                <Icon className="w-4 h-4" />
                {!collapsed && label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 text-gray-700 hover:text-black hover:bg-gray-50 transition"
                title={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              <p className="text-sm md:text-base font-semibold text-gray-900">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:text-black hover:border-gray-500 hover:bg-gray-50 transition"
              >
                <House className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website</span>
              </Link>
              {userInfo && (
                <button
                  type="button"
                  onClick={logoutHandler}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
