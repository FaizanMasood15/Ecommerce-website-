// src/components/ProductsSection.jsx

import React from 'react';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from '../slices/productsApiSlice';

// Accept both goToShop and goToProduct functions as props
const ProductsSection = ({ goToShop, goToProduct }) => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <section className="py-16 md:py-20 bg-background-light">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 text-center">

        {/* Section Title */}
        <h2 className="font-display text-3xl md:text-4xl tracking-[0.12em] uppercase font-medium text-gray-900 mb-10">
          Our Products
        </h2>

        {isLoading ? (
          <h2 className="text-xl text-gray-700">Loading products...</h2>
        ) : error ? (
          <h2 className="text-xl text-red-500">{error?.data?.message || error.error}</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 8).map(product => (
              <ProductCard
                key={product._id}
                product={product}
                goToProduct={goToProduct} // <--- CRITICAL FIX: Passing navigation function
              />
            ))}
          </div>
        )}

        {/* Show More Button (Uses the goToShop routing function) */}
        <button
          onClick={goToShop}
          className="bg-black hover:bg-gray-500 text-white text-sm tracking-[0.14em] font-semibold py-4 px-10 mt-10 transition duration-300 uppercase"
        >
          Show More
        </button>
      </div>
    </section >
  );
};

export default ProductsSection;

