// src/components/ProductCard.jsx

import React from 'react';
import { Share2, Scale, Heart } from 'lucide-react'; // Icons for hover state

// Example product data structure
// { 
//   id: 1, name: 'Syltherine', description: 'Stylish cafe chair', price: '2.500.000', 
//   originalPrice: '3.500.000', discount: 30, isNew: false, image: '/images/product-1.jpg' 
// }

const ProductCard = ({ product }) => {
  const isDiscounted = product.discount > 0;
  const isNew = product.isNew;

  return (
    // Card Container: White background, subtle shadow on hover, relative for absolute badge
    <div className="bg-white rounded-lg group relative overflow-hidden">
      
      {/* Product Image and Badges */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges (Absolute Positioning) */}
        {(isDiscounted || isNew) && (
          <div 
            className={`absolute top-4 right-4 h-12 w-12 flex items-center justify-center rounded-full 
                      text-white font-bold text-sm
                      ${isNew 
                        ? 'bg-secondary-accent' // Green for NEW
                        : 'bg-sale-red'} `} // Red for Sale
          >
            {isNew ? 'New' : `-${product.discount}%`}
          </div>
        )}
        
        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-50 
                    flex flex-col items-center justify-center space-y-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Add to Cart Button */}
          <button className="bg-white text-primary font-semibold py-2 px-8 hover:bg-gray-200 transition duration-300">
            Add to cart
          </button>
          
          {/* Share/Compare/Like Links */}
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
      <div className="p-4">
        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        {/* Description */}
        <p className="text-sm text-gray-500 mb-2">
          {product.description}
        </p>
        {/* Price (Flex for alignment) */}
        <div className="flex items-center space-x-3">
          {/* Current Price */}
          <span className="text-xl font-semibold text-gray-900">
            Rp {product.price}
          </span>
          {/* Original Price (Strikethrough if discounted) */}
          {isDiscounted && (
            <span className="text-base text-sale-red line-through">
              Rp {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;