import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Search, ShoppingCart, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useCart } from '../context/CartContext';
import logo from '/images/logo.png';

const Header = ({ toggleCart }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { totalItemCount } = useCart();

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-10 w-full">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer shrink-0">
          <img src={logo} alt="Faizan Butt Logo" className="w-8 h-8 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-gray-900">Faizan Butt</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-lg font-medium text-gray-900 hover:text-primary transition duration-150"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4 md:space-x-5 shrink-0">

          {userInfo ? (
            <div className="flex items-center space-x-4 md:space-x-5">
              {userInfo.isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-amber-700 transition"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}
              <Link
                to="/profile/orders"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition"
                title="My Orders"
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition"
                title="My Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={logoutHandler}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login">
              <User className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer" title="Login" />
            </Link>
          )}

          {/* Cart with badge */}
          <div className="relative">
            <ShoppingCart
              className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer"
              onClick={toggleCart}
            />
            {totalItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {totalItemCount > 9 ? '9+' : totalItemCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;