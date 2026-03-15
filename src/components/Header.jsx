// src/components/Header.jsx
// Professional mega-menu navigation — no emojis, clean luxury design
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, ShoppingBag, LogOut, LayoutDashboard,
  Heart, Menu, X, ChevronDown, ArrowRight, Search,
} from 'lucide-react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useCart } from '../context/CartContext';
import { useGetNavCategoriesQuery } from '../slices/categoriesApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { formatUsd } from '../utils/price';

// ─── Mega-menu dropdown ─────────────────────────────────────────────────────
const CategoryDropdown = ({ category, onClose }) => {
  const hasChildren = category.subcategories && category.subcategories.length > 0;

  return (
    <div className="absolute top-full left-0 pt-0 z-50">
      <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-4 min-w-[240px]">
        <ul className="flex flex-col">
          {hasChildren && category.subcategories.map(sub => (
            <li key={sub._id}>
              <Link
                to={`/shop?category=${sub.slug}`}
                onClick={onClose}
                className="block pl-6 pr-8 py-3.5 text-[15px] tracking-wide uppercase text-gray-700 hover:text-black hover:bg-stone-50 transition"
              >
                {sub.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={`/shop?category=${category.slug}`}
              onClick={onClose}
              className="block pl-6 pr-8 py-3.5 text-[15px] tracking-wide uppercase text-gray-700 hover:text-black hover:bg-stone-50 transition"
            >
              Shop All
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

// ─── Main Header ─────────────────────────────────────────────────────────────
const Header = ({ toggleCart }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { totalItemCount } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();

  const { data: navCategories = [] } = useGetNavCategoriesQuery();
  const { data: allProducts = [] } = useGetProductsQuery();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownTimerRef = useRef(null);
  const searchOverlayRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    document.addEventListener('keydown', onKeyDown);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? allProducts
      .filter((product) => {
        const searchableText = [
          product?.name,
          typeof product?.category === 'string' ? product.category : product?.category?.name,
          product?.description,
          typeof product?.brand === 'string' ? product.brand : product?.brand?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 20)
    : [];

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMouseEnter = (slug) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(slug);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const spacedLabel = (label = '') => label.split('').join(' ');

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-9 flex items-center justify-center">
          <p className="text-xs md:text-[13px] tracking-[0.28em] uppercase font-semibold">
            Free Shipping On Orders Above $100
          </p>
        </div>
      </div>
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-20 flex items-center gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="font-display text-[25px] leading-none font-medium tracking-[0.1em] text-[#0b1f47]">Funiro15</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-grow ml-8 lg:ml-12">
            <Link
              to="/"
              className="py-6 text-[15px] lg:text-[16px] tracking-wider uppercase font-medium text-stone-900 hover:text-black transition relative group"
              aria-label="Home"
            >
              <span className="leading-none">{spacedLabel('Home')}</span>
              <span className="absolute bottom-[18px] left-0 w-full h-[2px] bg-black transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
            </Link>
            <Link
              to="/shop"
              className="py-6 text-[15px] lg:text-[16px] tracking-wider uppercase font-medium text-stone-900 hover:text-black transition relative group"
              aria-label="Shop"
            >
              <span className="leading-none">{spacedLabel('Shop')}</span>
              <span className="absolute bottom-[18px] left-0 w-full h-[2px] bg-black transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"></span>
            </Link>

            {/* Dynamic category dropdowns */}
            {navCategories.map(cat => (
              <div
                key={cat._id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className={`flex items-center py-6 text-[15px] lg:text-[16px] font-medium tracking-wider uppercase transition relative ${activeDropdown === cat.slug
                    ? 'text-black'
                    : 'text-stone-900 hover:text-black'
                    }`}
                  aria-label={cat.name}
                >
                  <span className="leading-none">{spacedLabel(cat.name)}</span>
                  <span className={`absolute bottom-[18px] left-0 w-full h-[2px] bg-black transition-transform duration-300 origin-left ${activeDropdown === cat.slug ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </Link>

                {activeDropdown === cat.slug && (
                  <CategoryDropdown
                    category={cat}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4 shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              title="Search"
              className="text-stone-400 hover:text-gray-900 transition"
            >
              <Search className="w-[22px] h-[22px]" />
            </button>

            {userInfo?.isAdmin && (
              <div className="hidden md:flex items-center">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-stone-700 hover:text-black transition"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Admin
                </Link>
              </div>
            )}

            {/* User icons (desktop) */}
            {userInfo ? (
              <div className="hidden md:flex items-center gap-3">
                {userInfo?.isAdmin && <span className="w-px h-4 bg-stone-200" />}
                <Link to="/wishlist" title="Wishlist" className="text-stone-400 hover:text-red-500 transition">
                  <Heart className="w-[21px] h-[21px]" />
                </Link>
                <Link to="/profile/orders" title="My Orders" className="text-stone-400 hover:text-gray-900 transition">
                  <ShoppingBag className="w-[21px] h-[21px]" />
                </Link>
                <Link to="/profile" title="My Profile" className="text-stone-400 hover:text-gray-900 transition">
                  <User className="w-[21px] h-[21px]" />
                </Link>
                <button onClick={logoutHandler} title="Logout" className="cursor-pointer text-stone-400 hover:text-red-500 transition">
                  <LogOut className="w-[21px] h-[21px]" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-stone-400 hover:text-gray-900 transition" title="Login">
                  <User className="w-[21px] h-[21px]" />
                </Link>
              </div>
            )}

            {/* Cart */}
            <div className="relative cursor-pointer" onClick={toggleCart}>
              <ShoppingBag className="w-[22px] h-[22px] text-gray-700 hover:text-black transition" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none">
                  {totalItemCount > 9 ? '9+' : totalItemCount}
                </span>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-gray-600 hover:text-gray-900 transition"
              onClick={() => setMobileMenuOpen(v => !v)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-0.5">
            <Link to="/" className="block px-3 py-2.5 text-[15px] tracking-[0.12em] uppercase font-medium text-stone-800 hover:bg-stone-50 rounded-md transition">Home</Link>
            <Link to="/shop" className="block px-3 py-2.5 text-[15px] tracking-[0.12em] uppercase font-medium text-stone-800 hover:bg-stone-50 rounded-md transition">Shop</Link>

            {/* Category accordion */}
            {navCategories.map(cat => (
              <div key={cat._id}>
                <button
                  onClick={() => setMobileExpandedCat(mobileExpandedCat === cat._id ? null : cat._id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-medium tracking-[0.12em] uppercase text-stone-800 hover:bg-stone-50 rounded-md transition"
                >
                  <span className="leading-none">{cat.name}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpandedCat === cat._id ? 'rotate-180' : ''}`} />
                </button>
                {mobileExpandedCat === cat._id && (
                  <div className="ml-3 border-l border-stone-100 pl-3 mb-1 space-y-0.5">
                    <Link
                      to={`/shop?category=${cat.slug}`}
                      className="block px-3 py-2 text-sm font-semibold text-black hover:bg-stone-100 rounded transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop All {cat.name}
                    </Link>
                    {cat.subcategories?.map(sub => (
                      <Link
                        key={sub._id}
                        to={`/shop?category=${sub.slug}`}
                        className="block px-3 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-stone-50 rounded transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Divider */}
            <div className="pt-2 border-t border-stone-100 space-y-0.5 mt-2">
              {userInfo ? (
                <>
                  <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-stone-50 rounded transition">
                    <Heart className="w-4 h-4 text-red-400" /> Wishlist
                  </Link>
                  <Link to="/profile/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-stone-50 rounded transition">
                    <ShoppingBag className="w-4 h-4" /> My Orders
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-stone-50 rounded transition">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {userInfo.isAdmin && <>
                    <div className="border-t border-stone-100 my-1" />
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-black hover:bg-stone-100 rounded transition">
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  </>}
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    onClick={() => { logoutHandler(); setMobileMenuOpen(false); }}
                    className="cursor-pointer flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded w-full transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-600 hover:bg-stone-50 rounded transition">
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div
          ref={searchOverlayRef}
          className="fixed inset-0 z-[70] bg-[#dedede] px-4 md:px-8 pt-12 md:pt-14"
          onClick={(event) => {
            if (event.target === searchOverlayRef.current) closeSearch();
          }}
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="flex items-center gap-5 px-4 md:px-8">
              <div className="flex items-center bg-white border border-black/70 h-12 md:h-14 px-4 md:px-5 flex-grow">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder=""
                  className="w-full bg-transparent text-[18px] md:text-[20px] leading-none text-gray-900 placeholder:text-gray-400 outline-none font-light"
                />
                <Search className="w-6 h-6 text-slate-600 flex-shrink-0 stroke-[1.5]" />
              </div>
              <button
                onClick={closeSearch}
                className="text-slate-600 hover:text-black transition"
                aria-label="Close search"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-4 px-4 md:px-8">
              <div className="bg-white border border-stone-300/70 shadow-[0_8px_24px_rgba(0,0,0,0.12)] w-full md:w-[56%]">
                <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-stone-200">
                  <p className="text-[12px] md:text-[13px] tracking-[0.24em] uppercase text-slate-400">Products</p>
                </div>

                <div className="max-h-[58vh] overflow-y-auto">
                  {!normalizedSearch && (
                    <p className="px-6 md:px-8 py-8 text-slate-500 text-base">Type to search products...</p>
                  )}

                  {normalizedSearch && filteredProducts.length === 0 && (
                    <p className="px-6 md:px-8 py-8 text-slate-600 text-base">No products found for "{searchTerm}".</p>
                  )}

                  {filteredProducts.map((product) => (
                    <Link
                      key={product._id}
                      to={`/shop/${product.slug || product._id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 md:gap-6 px-6 md:px-8 py-4 md:py-5 border-b border-stone-200/70 hover:bg-stone-50 transition"
                    >
                      <img
                        src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                        alt={product.name}
                        className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] object-cover bg-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] md:text-[18px] leading-none tracking-[0.08em] uppercase text-slate-800 truncate font-light">
                          {product.name}
                        </p>
                        <p className="text-[13px] md:text-[14px] text-slate-500 mt-2 leading-none truncate font-light">
                          {typeof product.category === 'string' ? product.category : product.category?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 md:gap-4">
                        <p className="text-[16px] md:text-[18px] leading-none font-semibold text-slate-800">
                          {formatUsd(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[12px] md:text-[13px] leading-none text-slate-400 line-through">
                            {formatUsd(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
