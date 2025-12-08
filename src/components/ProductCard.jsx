// src/components/ProductCard.jsx - Updated to be clickable

import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { Share2, Scale, Heart } from 'lucide-react';

// The goToProduct prop is no longer strictly needed here since we use Link
const ProductCard = ({ product }) => { 
  const isDiscounted = product.discount > 0;
  const isNew = product.isNew;

  // Define the target path using the product ID
  const productPath = `/shop/${product.id}`; 

  return (
    // Use Link to wrap the entire card for navigation
    <Link 
      to={productPath}
      className="bg-white rounded-lg group relative overflow-hidden"
    >
      
      {/* Product Image and Badges */}
      <div 
        className="relative h-72 w-full overflow-hidden" // Remove cursor-pointer and onClick
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* ... Badges and Hover Overlay (unchanged) ... */}
        
        {/* Hover Overlay Actions - Keep button logic separate from card click for clarity */}
        <div className="absolute inset-0 bg-black bg-opacity-50 
                    flex flex-col items-center justify-center space-y-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          <button className="bg-white text-primary font-semibold py-2 px-8 hover:bg-gray-200 transition duration-300">
            Add to cart
          </button>
          
          <div className="flex space-x-4 text-white font-semibold text-sm">
            <a href="#" className="flex items-center hover:text-primary transition duration-300">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </a>
            <a href="#" className="flex items-center hover:text-primary transition duration-300">
              <Scale className="w-4 h-4 mr-1" /> Compare
            </a>
            <a href="#" className="flex items-center hover:text-primary transition duration-300">
              <Heart className="w-4 h-4 mr-1" /> Like
            </a>
          </div>
        </div>
      </div>

     {/* Product Info */}
      <div 
        className="p-4" // Remove cursor-pointer and onClick
      >
        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        {/* ... (rest of the info) ... */}
        <p className="text-sm text-gray-500 mb-2">
          {product.description}
        </p>
        <div className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-gray-900">
            Rp {product.price}
          </span>
          {isDiscounted && (
            <span className="text-base text-sale-red line-through">
              Rp {product.originalPrice}
            </span>
          )}
        </div>
      </div>
</Link> // <-- End of Link wrapper
  );
};

export default ProductCard;