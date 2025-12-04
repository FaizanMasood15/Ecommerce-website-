// src/components/Header.jsx - Update to use the routing functions

import React from 'react';
import { User, Search, Heart, ShoppingCart } from 'lucide-react';

// Accept routing functions as props
const Header = ({ goToHome, goToShop }) => {
  // Use functions instead of traditional links
  const navItems = [
    { name: 'Home', action: goToHome }, // <-- Use goToHome function
    { name: 'Shop', action: goToShop }, // <-- Use goToShop function
    { name: 'About', action: () => alert('Navigate to About') },
    { name: 'Contact', action: () => alert('Navigate to Contact') },
  ];

  return (
    <header className="sticky top-0 bg-white shadow-md z-10">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo (Now clicks back to Home) */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={goToHome}>
          <img src="public/images/logo.png" alt="Faizan Butt Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-bold text-gray-900">Faizan Butt</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-10"> 
          {navItems.map((item) => (
            <button 
              key={item.name} 
              onClick={item.action} // <-- Call the function on click
              className="text-lg font-medium text-gray-900 hover:text-primary transition duration-150"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Action Icons... (rest of the header remains the same) */}
        <div className="flex items-center space-x-6">
          <User className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          <Search className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          <Heart className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-900 hover:text-primary cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;