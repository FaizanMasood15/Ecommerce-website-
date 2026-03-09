// src/components/ProductCard.jsx - Updated to be clickable

import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import { Share2, Scale, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatUsd } from '../utils/price';
import { sanitizeRichHtml } from '../utils/sanitizeHtml';

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
      className="group relative overflow-hidden"
    >

      {/* Product Image and Badges */}
      <div
        className="relative h-[22rem] w-full overflow-hidden bg-[#f3f4f6]" // Remove cursor-pointer and onClick
      >
        <img
          src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        {/* ... Badges and Hover Overlay (unchanged) ... */}

        {/* Hover Overlay Actions - Keep button logic separate from card click for clarity */}
        <div className="absolute inset-0 bg-black bg-opacity-50 
                    flex flex-col items-center justify-center space-y-4 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          <button
            onClick={handleAddToCart}
            className="bg-white text-black text-xs tracking-[0.18em] uppercase font-semibold py-3 px-8 hover:bg-gray-100 transition duration-300 border border-black">
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
        className="px-5 pt-6 pb-5 bg-[#f4f5f7]" // Remove cursor-pointer and onClick
      >
        {/* Name */}
        <h3 className="font-display text-[18px] leading-snug font-semibold tracking-[0.11em] uppercase text-[#0b1f47] mb-1 text-center">
          {product.name}
        </h3>
        {/* ... (rest of the info) ... */}
        <div
          className="text-sm text-gray-500 mb-4 line-clamp-2 text-center"
          dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(product.description) }}
        />
        <div className="flex items-center space-x-3">
          <span className="font-display text-[22px] font-semibold tracking-[0.02em] text-[#0b1f47]">
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
