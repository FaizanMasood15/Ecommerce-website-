// src/components/Header.jsx
// Professional mega-menu navigation — no emojis, clean luxury design
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, ShoppingCart, LogOut, LayoutDashboard, ShoppingBag,
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
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
      <div className="bg-white shadow-xl border-t-2 border-black overflow-hidden"
        style={{ minWidth: hasChildren ? '280px' : '220px' }}>

        {/* "Shop All" header row */}
        <Link
          to={`/shop?category=${category.slug}`}
          onClick={onClose}
          className="flex items-center justify-between px-6 py-4 bg-stone-50 hover:bg-stone-100 border-b border-stone-100 transition group"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-semibold mb-0.5">
              Collection
            </p>
            <p className="font-bold text-gray-900 text-base">
              Shop All {category.name}
            </p>
            {category.description && (
              <p className="text-xs text-gray-500 mt-0.5">{category.description}</p>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-900 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 flex-shrink-0 ml-4" />
        </Link>

        {/* Subcategory list */}
        {hasChildren && (
          <ul className="py-2">
            {category.subcategories.map(sub => (
              <li key={sub._id}>
                <Link
                  to={`/shop?category=${sub.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-stone-50 transition group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-black flex-shrink-0 transition-colors" />
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
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

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-black text-white">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-9 flex items-center justify-center">
          <p className="text-xs md:text-[13px] tracking-[0.28em] uppercase font-semibold">
            Free Shipping On Orders Above Rs. 2500
          </p>
        </div>
      </div>
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-20 flex items-center gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
             <span className="font-display text-[30px] leading-none font-medium tracking-[0.1em] text-[#0b1f47]">FB15</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 flex-grow ml-6">
            <Link
              to="/"
              className="px-2 py-2 text-[16px] tracking-[0.08em] uppercase font-medium text-stone-700 hover:text-black rounded transition"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="px-2 py-2 text-[16px] tracking-[0.08em] uppercase font-medium text-stone-700 hover:text-black rounded transition"
            >
              Shop
            </Link>

            {/* Dynamic category dropdowns */}
            {navCategories.map(cat => (
              <div
                key={cat._id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1.5 px-2 py-2 text-[16px] font-medium tracking-[0.08em] uppercase rounded-md transition ${activeDropdown === cat.slug
                    ? 'text-black'
                    : 'text-stone-700 hover:text-black'
                    }`}
                >
                  <span className="leading-none">{cat.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${activeDropdown === cat.slug ? 'rotate-180 opacity-100' : ''
                      }`}
                  />
                </button>

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
              <ShoppingCart className="w-[22px] h-[22px] text-gray-700 hover:text-black transition" />
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
            <Link to="/" className="block px-3 py-2.5 text-[15px] tracking-[0.12em] uppercase font-medium text-stone-700 hover:bg-stone-50 rounded-md transition">Home</Link>
            <Link to="/shop" className="block px-3 py-2.5 text-[15px] tracking-[0.12em] uppercase font-medium text-stone-700 hover:bg-stone-50 rounded-md transition">Shop</Link>

            {/* Category accordion */}
            {navCategories.map(cat => (
              <div key={cat._id}>
                <button
                  onClick={() => setMobileExpandedCat(mobileExpandedCat === cat._id ? null : cat._id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-medium tracking-[0.12em] uppercase text-stone-700 hover:bg-stone-50 rounded-md transition"
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
          className="fixed inset-0 z-[70] bg-[#e8e8e8]/88 px-4 md:px-8 pt-16 md:pt-20"
          onClick={(event) => {
            if (event.target === searchOverlayRef.current) closeSearch();
          }}
        >
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="flex items-center bg-white border border-black/70 h-14 md:h-[62px] px-4 md:px-5">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder=""
                className="w-full bg-transparent text-[18px] md:text-[22px] leading-none text-gray-900 placeholder:text-gray-400 outline-none font-light"
              />
              <Search className="w-8 h-8 text-slate-600 flex-shrink-0 stroke-[1.5]" />
            </div>

            <div className="mt-5 bg-[#f1f1f1] border border-stone-300/70">
              <div className="flex justify-between items-center px-5 md:px-10 py-4 border-b border-stone-300/60">
                <p className="text-[12px] md:text-[14px] tracking-[0.2em] uppercase text-slate-500">Products</p>
                <button onClick={closeSearch} className="text-slate-500 hover:text-black transition" aria-label="Close search">
                  <X className="w-8 h-8 stroke-[1.5]" />
                </button>
              </div>

              <div className="max-h-[58vh] overflow-y-auto">
                {!normalizedSearch && (
                  <p className="px-5 md:px-10 py-8 text-slate-500 text-base">Type to search products...</p>
                )}

                {normalizedSearch && filteredProducts.length === 0 && (
                  <p className="px-5 md:px-10 py-8 text-slate-600 text-base">No products found for "{searchTerm}".</p>
                )}

                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/shop/${product.slug || product._id}`}
                    onClick={closeSearch}
                    className="grid grid-cols-[74px,1fr,120px] md:grid-cols-[84px,1fr,160px] gap-4 md:gap-6 px-5 md:px-10 py-4 md:py-5 border-b border-stone-300/50 hover:bg-stone-100/50 transition"
                  >
                    <img
                      src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                      alt={product.name}
                      className="w-[74px] h-[74px] md:w-[84px] md:h-[84px] object-cover bg-stone-100"
                    />
                    <div className="min-w-0 self-center">
                      <p className="text-[18px] md:text-[20px] leading-none tracking-[0.06em] uppercase text-slate-800 truncate font-light">
                        {product.name}
                      </p>
                      <p className="text-[14px] md:text-[16px] text-slate-500 mt-2 leading-none truncate font-light">
                        {typeof product.category === 'string' ? product.category : product.category?.name}
                      </p>
                    </div>
                    <div className="self-end text-right pb-1">
                      <p className="text-[18px] md:text-[20px] leading-none font-semibold text-slate-800">
                        {formatUsd(product.price)}
                      </p>
                      {product.originalPrice && (
                        <p className="text-[13px] md:text-[14px] leading-none text-slate-400 line-through mt-1.5">
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
      )}
    </header>
  );
};

export default Header;
