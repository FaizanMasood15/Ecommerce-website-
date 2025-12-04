// src/components/ProductsSection.jsx

import React from 'react';
import ProductCard from './ProductCard';
// Import the centralized data
import { ALL_PRODUCTS } from '../data/products';

// Accept the routing function as a prop
const ProductsSection = ({ goToShop }) => {
  // Home page only displays the first 8 products
  const homeProducts = ALL_PRODUCTS.slice(0, 8);

  return (
    <section className="py-16 md:py-20 bg-background-light">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 text-center">
        
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          Our Products
        </h2>

        {/* Products Grid (4 columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {homeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Show More Button (Now uses the routing function) */}
        <button 
          onClick={goToShop} // <-- Call the routing function here
          className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-10 mt-10 transition duration-300 uppercase"
        >
          Show More
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;