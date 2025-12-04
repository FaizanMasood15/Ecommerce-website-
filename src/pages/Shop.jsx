// src/pages/Shop.jsx (Updated with background image)

import React from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
// Import all products
import { ALL_PRODUCTS } from '../data/products';

// The shop page displays the first 16 products for the first view
const shopProducts = ALL_PRODUCTS.slice(0, 16); 
const totalResults = ALL_PRODUCTS.length; // 32 total products

const ShopPage = () => {
  return (
    <>
      {/* 1. Shop Banner (Updated with Image Background) */}
      <div 
        className="py-24 text-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/shop.jpg')" }}
      >
        {/* Overlay for better text visibility, matching Checkout/Cart designs */}
        <div className="absolute inset-0 bg-white opacity-60"></div>
        
        <div className="relative z-10"> {/* Ensure text is above the overlay */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-900 text-sm">
            Home <span className="font-semibold text-primary"> &gt; Shop</span>
          </p>
        </div>
      </div>

      {/* 2. Filter / Sort Bar */}
      <div className="bg-background-light py-4 md:py-6">
        {/* ... (rest of the Filter / Sort Bar content is unchanged) */}
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Side: Filter and Result Count */}
          <div className="flex items-center space-x-6">
            <button className="flex items-center text-lg font-medium text-gray-900 hover:text-primary transition duration-150">
              <SlidersHorizontal className="w-6 h-6 mr-2" /> Filter
            </button>
            
            <div className='flex items-center space-x-4'>
                <Grid3X3 className="w-6 h-6 text-gray-900 cursor-pointer hover:text-primary" />
                <List className="w-6 h-6 text-gray-500 cursor-pointer hover:text-primary" />
            </div>

            {/* Dynamic Results Count */}
            <span className="text-gray-500 text-base">
              Showing 1-16 of {totalResults} results
            </span>
          </div>

          {/* Right Side: Show and Sort Dropdowns */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 text-base">Show</span>
              <select className="bg-white border border-gray-300 p-2 rounded-lg text-base">
                <option value="16">16</option>
                <option value="32">32</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-900 text-base">Sort by</span>
              <select className="bg-white border border-gray-300 p-2 rounded-lg text-base">
                <option value="default">Default</option>
                <option value="price-asc">Price A-Z</option>
                <option value="price-desc">Price Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Grid */}
      <div className="py-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {shopProducts.map(product => (
              <ProductCard key={product.id} product={product} /> 
            ))}
          </div>

          {/* 4. Pagination */}
          <div className="flex justify-center space-x-4 mt-10">
            <button className="bg-primary text-white font-semibold py-3 px-5 rounded-lg">
              1
            </button>
            <button className="bg-hero-box text-gray-900 font-semibold py-3 px-5 rounded-lg hover:bg-primary hover:text-white transition duration-200">
              2
            </button>
            <button className="bg-hero-box text-gray-900 font-semibold py-3 px-5 rounded-lg hover:bg-primary hover:text-white transition duration-200">
              3
            </button>
            <button className="bg-hero-box text-gray-900 font-semibold py-3 px-5 rounded-lg hover:bg-primary hover:text-white transition duration-200">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5. Feature Strip */}
      <FeatureStrip />
    </>
  );
};

export default ShopPage;