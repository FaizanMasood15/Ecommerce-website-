// src/components/Header.jsx - Using Link for Navigation

import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { User, Search, Heart, ShoppingCart } from 'lucide-react';
import logo from '/images/logo.png';
import { images } from '../data/productImages';

// We no longer need goToHome/goToShop props for the main links
const Header = ({ toggleCart }) => { 
  
  // Navigation Links using Link component
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' }, // Assuming future page
    { name: 'Contact', path: '/contact' }, // Assuming future page
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-10">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo: Use Link to go to the root path */}
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <img src={logo} alt="Faizan Butt Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-bold text-gray-900">Faizan Butt</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-10"> 
          {navItems.map((item) => (
            // Use Link for proper routing
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
        <div className="flex items-center space-x-6">
          <User className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          <Search className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          <Heart className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          
          <div className="relative">
            {/* Cart Icon uses the toggle function */}
            <ShoppingCart 
                className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" 
                onClick={toggleCart} 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;