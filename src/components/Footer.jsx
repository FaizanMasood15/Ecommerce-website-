import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  const links = [
    { title: 'Home', to: '/' },
    { title: 'Shop', to: '/shop' },
    { title: 'Contact', to: '/contact' },
  ];

  const help = [
    { title: 'Payment Options', href: '#' },
    { title: 'Returns', to: '/returns' },
    { title: 'Privacy Policy', to: '/privacy-policy' },
  ];

  const socialLinks = [
    { title: 'Facebook', href: '#', icon: Facebook },
    { title: 'Instagram', href: '#', icon: Instagram },
    { title: 'YouTube', href: '#', icon: Youtube },
    { title: 'Twitter', href: '#', icon: Twitter },
  ];

  return (
    <footer className="bg-white border-t border-stone-200 pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-gray-200 pb-10 mb-8">
          
          {/* Column 1: Company Info (Updated to Faizan Masood 15) */}
          <div>
            <h3 className="font-display text-2xl tracking-[0.14em] font-medium text-gray-900 mb-6">FB15</h3>
            <p className="text-sm text-gray-500 mb-2">
              Sialkot, Punjab, Pakistan
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Email:{' '}
              <a href="mailto:faizanbutt15@yahoo.com" className="text-gray-900 hover:text-black underline underline-offset-2">
                faizanbutt15@yahoo.com
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Phone: 03027959570
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.title}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.title}
                    className="inline-flex items-center justify-center w-9 h-9 border border-black text-black hover:bg-gray-700 hover:text-white transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">Links</h4>
            <ul className="space-y-4">
              {links.map((item) => (
                <li key={item.title}>
                  <Link to={item.to} className="text-sm tracking-[0.08em] uppercase text-gray-900 hover:text-black transition duration-150">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">Help</h4>
            <ul className="space-y-4">
              {help.map((item) => (
                <li key={item.title}>
                  {item.to ? (
                    <Link to={item.to} className="text-sm tracking-[0.08em] uppercase text-gray-900 hover:text-black transition duration-150">
                      {item.title}
                    </Link>
                  ) : (
                    <a href={item.href} className="text-sm tracking-[0.08em] uppercase text-gray-900 hover:text-black transition duration-150">
                      {item.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">Contact</h4>
            <p className="text-sm text-gray-600 mb-3">Need help with an order or product inquiry?</p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-black text-white hover:bg-gray-700 text-xs tracking-[0.12em] uppercase font-semibold py-3 px-5 transition duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Column 5: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-6">Newsletter</h4>
            <div className="flex space-x-3">
              <input 
                type="email" 
                placeholder="Enter Your Email Address" 
                className="px-4 py-2 border-b border-gray-400 focus:border-black focus:outline-none flex-grow text-sm"
              />
              <button className="text-xs tracking-[0.16em] uppercase font-semibold border-b border-black hover:text-black transition duration-150">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <p className="text-sm text-gray-900 tracking-[0.04em]">
          2026 Faizan Masood 15. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;


