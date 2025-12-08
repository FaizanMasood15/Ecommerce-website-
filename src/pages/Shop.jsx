// src/pages/Shop.jsx (Adding Category Filter Functionality)

import React, { useState } from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import { ALL_PRODUCTS } from '../data/products';

// Constants for pagination
const PRODUCTS_PER_PAGE = 16;
const totalResults = ALL_PRODUCTS.length; 
const totalPages = Math.ceil(totalResults / PRODUCTS_PER_PAGE);

// Mock categories for the filter dropdown
const categories = ['All', 'Chairs', 'Sofas', 'Lamps', 'Tables'];

// Accept goToProduct function as a prop
const ShopPage = ({ goToProduct }) => {
  // State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State for Sorting
  const [sortOrder, setSortOrder] = useState('default'); 
  // NEW STATE: Filter by Category (Default is All)
  const [selectedCategory, setSelectedCategory] = useState('All'); 

  // --- FILTERING LOGIC ---
  const filterProducts = (products) => {
    if (selectedCategory === 'All') {
      return products;
    }
    // Simple filter: Check if description contains the category name (e.g., 'chair' for 'Chairs')
    const lowerCategory = selectedCategory.toLowerCase().slice(0, -1); // 'Chairs' -> 'chair'
    
    return products.filter(product => 
      product.description.toLowerCase().includes(lowerCategory)
    );
  };

  // --- SORTING LOGIC (Unchanged) ---
  const sortProducts = (products) => {
    const sortedProducts = [...products];
    if (sortOrder === 'price-asc') {
      sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[Rp\.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[Rp\.]/g, ''));
        return priceA - priceB;
      });
    } else if (sortOrder === 'price-desc') {
      sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[Rp\.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[Rp\.]/g, ''));
        return priceB - priceA;
      });
    }
    return sortedProducts;
  };
  
  // 1. Filter the products first
  const filteredProducts = filterProducts(ALL_PRODUCTS);
  
  // 2. Sort the filtered products
  const sortedAndFilteredProducts = sortProducts(filteredProducts);
  
  // Update total pages based on filtered results
  const currentTotalResults = sortedAndFilteredProducts.length;
  const currentTotalPages = Math.ceil(currentTotalResults / PRODUCTS_PER_PAGE);


  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  // Slice the sorted and filtered array for the current page
  const shopProducts = sortedAndFilteredProducts.slice(startIndex, endIndex);


  // Function to handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= currentTotalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 400, behavior: 'smooth' }); 
    }
  };
  
  // Handler for category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to page 1 after changing filter
  };


  return (
    <>
      {/* 1. Shop Banner (Unchanged) */}
      <div 
        className="py-24 text-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/shop.jpg')" }}
      >
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-900 text-sm">
            Home <span className="font-semibold text-primary"> &gt; Shop</span>
          </p>
        </div>
      </div>

      {/* 2. Filter / Sort Bar (Now with functional Category Filter) */}
      <div className="bg-background-light py-4 md:py-6">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Side: Filter and Result Count */}
          <div className="flex items-center space-x-6">
            
            {/* Filter Dropdown (Visible filter control) */}
            <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-6 h-6 text-gray-900" />
                <span className="text-lg font-medium text-gray-900">Filter By:</span>
                <select 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="bg-white border border-gray-300 p-2 rounded-lg text-base"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            
            <div className='flex items-center space-x-4'>
                <Grid3X3 className="w-6 h-6 text-gray-900 cursor-pointer hover:text-primary" />
                <List className="w-6 h-6 text-gray-500 cursor-pointer hover:text-primary" />
            </div>

            {/* Dynamic Results Count */}
            <span className="text-gray-500 text-base">
              Showing {Math.min(startIndex + 1, currentTotalResults)}-{Math.min(endIndex, currentTotalResults)} of {currentTotalResults} results
            </span>
          </div>

          {/* Right Side: Show and Sort Dropdowns */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Show Dropdown (Static) */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 text-base">Show</span>
              <select className="bg-white border border-gray-300 p-2 rounded-lg text-base">
                <option value="16">16</option>
              </select>
            </div>

            {/* Sort Dropdown (Functional) */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-900 text-base">Sort by</span>
              <select 
                value={sortOrder} 
                onChange={(e) => {
                  setSortOrder(e.target.value); 
                  handlePageChange(1); 
                }}
                className="bg-white border border-gray-300 p-2 rounded-lg text-base"
              >
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
              <ProductCard 
                key={product.id} 
                product={product} 
                goToProduct={goToProduct} 
              /> 
            ))}
          </div>

          {/* 4. Pagination (Functional) */}
          <div className="flex justify-center space-x-4 mt-10">
            {/* Render numbered buttons */}
            {[...Array(currentTotalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  // Apply active styling
                  className={`${
                    currentPage === pageNumber
                      ? 'bg-primary text-white'
                      : 'bg-hero-box text-gray-900 hover:bg-primary hover:text-white'
                  } font-semibold py-3 px-5 rounded-lg transition duration-200`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {/* Next Button (Only show if not on the last page) */}
            {currentPage < currentTotalPages && (
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-hero-box text-gray-900 font-semibold py-3 px-5 rounded-lg hover:bg-primary hover:text-white transition duration-200"
                >
                  Next
                </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Feature Strip */}
      <FeatureStrip />
    </>
  );
};

export default ShopPage;