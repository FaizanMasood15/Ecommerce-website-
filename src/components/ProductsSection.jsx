// src/components/ProductsSection.jsx

import React from 'react';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '../data/products';

// Accept both goToShop and goToProduct functions as props
const ProductsSection = ({ goToShop, goToProduct }) => {
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
            <ProductCard 
              key={product.id} 
              product={product} 
              goToProduct={goToProduct} // <--- CRITICAL FIX: Passing navigation function
            />
          ))}
        </div>
        
        {/* Show More Button (Uses the goToShop routing function) */}
        <button 
          onClick={goToShop}
          className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-10 mt-10 transition duration-300 uppercase"
        >
          Show More
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;