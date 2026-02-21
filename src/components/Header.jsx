import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, Search, Heart, ShoppingCart, LogOut } from 'lucide-react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import logo from '/images/logo.png';
import { images } from '../data/productImages';

const Header = ({ toggleCart }) => {
  const { userInfo } = useSelector((state) => state.auth);

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

  // Navigation Links using Link component
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
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
        <div className="flex items-center space-x-4 md:space-x-6 shrink-0">

          {userInfo ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden sm:inline-block text-sm font-medium text-gray-700">Hi, {userInfo.name.split(' ')[0]}</span>
              <LogOut
                className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer"
                onClick={logoutHandler}
                title="Logout"
              />
            </div>
          ) : (
            <Link to="/login">
              <User className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer" title="Login" />
            </Link>
          )}

          <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer hidden sm:block" />
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer hidden sm:block" />

          <div className="relative">
            <ShoppingCart
              className="w-5 h-5 md:w-6 md:h-6 text-gray-900 hover:text-primary cursor-pointer"
              onClick={toggleCart}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;