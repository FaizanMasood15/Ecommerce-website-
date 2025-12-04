// src/components/Footer.jsx - Updated with your name

import React from 'react';

const Footer = () => {
  const links = [
    { title: 'Home', link: '#' },
    { title: 'Shop', link: '#' },
    { title: 'About', link: '#' },
    { title: 'Contact', link: '#' },
  ];

  const help = [
    { title: 'Payment Options', link: '#' },
    { title: 'Returns', link: '#' },
    { title: 'Privacy Policies', link: '#' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-200 pb-10 mb-8">
          
          {/* Column 1: Company Info (Updated to Faizan Butt) */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">Faizan Butt.</h3>
            <p className="text-base text-gray-500 mb-2">
              400 University Drive Suite 200 Coral Gables, FL 33134 USA
            </p>
          </div>
{/* ... (rest of the columns are unchanged) */}
          {/* Column 2: Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-500 mb-6">Links</h4>
            <ul className="space-y-4">
              {links.map((item) => (
                <li key={item.title}>
                  <a href={item.link} className="text-base text-gray-900 hover:text-primary transition duration-150">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="text-lg font-semibold text-gray-500 mb-6">Help</h4>
            <ul className="space-y-4">
              {help.map((item) => (
                <li key={item.title}>
                  <a href={item.link} className="text-base text-gray-900 hover:text-primary transition duration-150">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-gray-500 mb-6">Newsletter</h4>
            <div className="flex space-x-3">
              <input 
                type="email" 
                placeholder="Enter Your Email Address" 
                className="px-4 py-2 border-b border-gray-400 focus:border-primary focus:outline-none flex-grow text-base"
              />
              <button className="text-base font-medium border-b border-black hover:border-primary hover:text-primary transition duration-150">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <p className="text-base text-gray-900">
          2023 Faizan Butt. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;