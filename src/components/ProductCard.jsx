// src/components/ProductCard.jsx - Updated to be clickable

import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { Share2, Scale, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatUsd } from '../utils/price';

// The goToProduct prop is no longer strictly needed here since we use Link
const ProductCard = ({ product }) => {
  const isDiscounted = product.discount > 0;
  const isNew = product.isNew;

  // Define the target path using the product URL slug
  const productPath = `/shop/${product.slug || product.id}`;
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to the product detail page when clicking the button
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : '';
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
    addToCart(product, 1, defaultColor, defaultSize);
  };

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
          src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* ... Badges and Hover Overlay (unchanged) ... */}

        {/* Hover Overlay Actions - Keep button logic separate from card click for clarity */}
        <div className="absolute inset-0 bg-black bg-opacity-50 
                    flex flex-col items-center justify-center space-y-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          <button
            onClick={handleAddToCart}
            className="bg-white text-primary font-semibold py-2 px-8 hover:bg-gray-200 transition duration-300">
            Add to cart
          </button>

          <div className="flex space-x-4 text-white font-semibold text-sm">
            <span className="flex items-center hover:text-primary transition duration-300 cursor-pointer">
              <Share2 className="w-4 h-4 mr-1" /> Share
            </span>
            <span className="flex items-center hover:text-primary transition duration-300 cursor-pointer">
              <Scale className="w-4 h-4 mr-1" /> Compare
            </span>
            <span className="flex items-center hover:text-primary transition duration-300 cursor-pointer">
              <Heart className="w-4 h-4 mr-1" /> Like
            </span>
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
        <div
          className="text-sm text-gray-500 mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
        <div className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-gray-900">
            {formatUsd(product.price)}
          </span>
          {isDiscounted && (
            <span className="text-base text-sale-red line-through">
              {formatUsd(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link> // <-- End of Link wrapper
  );
};

export default ProductCard;
