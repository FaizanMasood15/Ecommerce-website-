// src/pages/ProductDetailPage.jsx (Updated to use imported images)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Share2, Facebook, Twitter, Linkedin, Star, Minus, Plus } from 'lucide-react';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import { images } from '../data/productImages';
import { useCart } from '../context/CartContext';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import ProductDetailSkeleton from '../components/ProductDetailSkeleton';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// --- DUMMY DATA FOR COMPLEX DETAILS ---
const productDetails = {
  // 1. Asgaard sofa details 
  'Asgaard sofa': {
    reviews: 5,
    rating: 4.7,
    images: [images.asgaard1, images.asgaard2, images.asgaard3, images.asgaard4],
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Blue', hex: '#1E90FF' },
    ],
    sizes: ['L', 'XL', 'XS'],
    sku: 'SS001',
    category: 'Sofas',
    fullDescription: "Setting the bar as one of the loudest speakers in its class, the Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear midrange and extended highs for a sound. Embodying the raw, wayward spirit of rock n' roll, the Kilburn portable active stereo speaker takes the unmistakable look and sound of Marshall, unplugs the chords, and takes the show on the road.",
  },
  // 2. Default details for all OTHER products 
  'default': {
    images: [images.defaultMain],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Tan', hex: '#B88E2F' },
    ],
    sizes: ['S', 'M', 'L'],
    reviews: 1,
    rating: 4.0,
    fullDescription: "This product is part of our default collection. All options (size and color) are placeholders until specific details are available. Add it to your cart today!",
  }
};


const ProductDetailPage = ({ goToProduct, goToShop, toggleCart }) => {

  const { productId: idParam } = useParams();

  const { data: selectedProduct, isLoading, error } = useGetProductDetailsQuery({ id: idParam });
  const { addToCart, subtotal } = useCart(); // <-- Use the Cart hook
  let product;

  if (selectedProduct) {
    const productSpecificDetails = productDetails[selectedProduct.name] || productDetails.default;

    // Fallback to legacy single image if array is empty or undefined
    const validImages = selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.image];

    product = {
      ...productSpecificDetails,
      ...selectedProduct,
      images: validImages, // Override dummy images with real DB array
      sku: selectedProduct.sku || selectedProduct._id.toString().substring(0, 4).padStart(4, '0'),
      category: selectedProduct.category,
      mainImage: validImages[0], // Set first array item as main image
      basePrice: parseFloat(selectedProduct.price?.toString().replace(/[Rp\.]/g, '') || 0),
    };
  } else {
    const defaultAsgaard = {
      id: 100,
      name: 'Asgaard sofa',
      price: 250000.00,
      image: productDetails['Asgaard sofa'].images[0],
      ...productDetails['Asgaard sofa'],
      basePrice: 250000.00,
    };
    product = defaultAsgaard;
    product.mainImage = product.image;
  }
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  const [mainImageSource, setMainImageSource] = useState(product?.mainImage || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setMainImageSource(product.mainImage);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setQuantity(1);
    }
  }, [product?.mainImage]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <div className="py-24 text-center text-red-500 font-bold">Error: {error?.data?.message || error.error}</div>;

  // We temporarily disable related products while moving to MongoDB
  const relatedProducts = [];
  const handleAddToCart = () => {
    // Call the global function with the entire product object alongside quantity/size/color
    addToCart(product, quantity, selectedColor, selectedSize);
    if (toggleCart) {
      toggleCart();
    }
  };
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Determine current variant based on selections
  const currentVariant = product.variants?.find(
    (v) => (v.size || '') === selectedSize && (v.color || '') === selectedColor
  );

  const displayPrice = currentVariant && currentVariant.price > 0
    ? currentVariant.price
    : product.basePrice;

  const displayStock = currentVariant
    ? currentVariant.countInStock
    : product.countInStock;

  const formattedPrice = `Rs. ${displayPrice.toLocaleString('en-IN')}.00`;
  const ratingStars = [...Array(Math.floor(product?.rating || 5))].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />);

  const TabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <div className="space-y-4 text-gray-700">
            <div
              className="mt-4 prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            <p>
              {product.fullDescription || "Detailed description is coming soon. Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>
          </div>
        );
      case 'Additional Information':
        return (
          <table className="w-full text-left text-gray-700">
            <tbody>
              <tr className="border-b">
                <th className="py-2 pr-4 font-semibold w-1/4">Weight</th>
                <td className="py-2 pl-4">50 kg</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 pr-4 font-semibold">Dimensions</th>
                <td className="py-2 pl-4">150 x 80 x 75 cm</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 pr-4 font-semibold">Material</th>
                <td className="py-2 pl-4">Wood, Fabric Cotton</td>
              </tr>
            </tbody>
          </table>
        );
      case 'Reviews':
        return (
          <div className="mt-4 text-gray-700">
            <p>Displaying {product.reviews || 5} customer reviews for {product.name}.</p>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <>
      {/* Breadcrumb Section */}
      <div className="bg-hero-box py-6 md:py-8">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-gray-900 text-sm">
            Home &gt; Shop &gt; <span className="font-semibold text-gray-900">{product.name}</span>
          </p>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="py-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Side: Images */}
          <div className="flex space-x-4">
            {/* Thumbnails Column */}
            <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {product.images && product.images.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  onClick={() => setMainImageSource(imgSrc)}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition duration-150 ${mainImageSource === imgSrc ? 'border-2 border-primary opacity-100' : 'opacity-60'}`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div
              className="flex-grow cursor-pointer group relative overflow-hidden rounded-lg"
              onClick={() => {
                const currentIdx = product.images ? product.images.findIndex(img => img === mainImageSource) : 0;
                setLightboxIndex(currentIdx >= 0 ? currentIdx : 0);
                setLightboxOpen(true);
              }}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10 flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 bg-white/80 text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-opacity duration-300">
                  Click to Expand
                </span>
              </div>
              <img
                src={mainImageSource}
                alt={product.name}
                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right Side: Details and Controls (Unchanged) */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-gray-900">{product.name}</h1>
            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium text-gray-900">{formattedPrice}</p>

              {/* Urgency/Stock Badge */}
              <div className="flex items-center">
                {displayStock > 5 && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full animate-pulse"></span>
                    In Stock
                  </span>
                )}
                {displayStock > 0 && displayStock <= 5 && (
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                    <span className="w-2 h-2 mr-1 bg-red-500 rounded-full animate-pulse"></span>
                    🔥 High Demand: Only {displayStock} left!
                  </span>
                )}
                {(displayStock === 0 || displayStock == null) && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex text-primary">
                {ratingStars}
              </div>
              <span className="text-gray-500 text-sm">|</span>
              <span className="text-gray-500">{product.reviews || 5} Customer Review</span>
            </div>

            <div
              className="text-gray-700 text-base max-w-lg prose prose-sm"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-500">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold flex items-center justify-center transition-all 
                        ${selectedSize === size
                          ? 'bg-primary text-white shadow-md border-transparent'
                          : 'bg-white text-gray-900 border border-gray-300 hover:border-primary hover:text-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-500">Color</h3>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex flex-col items-center space-y-1 p-2 rounded-lg border transition-all 
                        ${selectedColor === color.name
                          ? 'bg-blue-50 border-primary shadow-sm'
                          : 'bg-white border-transparent hover:border-gray-300'}`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border shadow-sm flex items-center justify-center"
                        style={{ backgroundColor: color.hex, borderColor: color.hex === '#ffffff' || color.hex === '#FFFFFF' ? '#e5e7eb' : color.hex }}
                      >
                        {selectedColor === color.name && <span className={color.hex === '#ffffff' || color.hex === '#FFFFFF' ? 'text-black text-sm' : 'text-white text-sm'}>✓</span>}
                      </span>
                      <span className={`text-xs ${selectedColor === color.name ? 'font-semibold text-primary' : 'text-gray-600'}`}>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">

              <div className="flex items-center space-x-2 border border-gray-400 rounded-lg">
                <button onClick={decreaseQuantity} className="p-3 text-lg text-gray-900 hover:bg-gray-100 transition duration-150">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= displayStock}
                  className={`p-3 text-lg transition duration-150 ${quantity >= displayStock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={displayStock === 0 || !displayStock}
                className={`border text-primary font-semibold py-3 px-8 rounded-lg transition duration-300 uppercase ${(displayStock === 0 || !displayStock) ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-primary hover:bg-primary hover:text-white'
                  }`}
              >
                Add To Cart
              </button>

              <button className="hidden sm:flex border border-gray-400 text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition duration-300 uppercase items-center">
                + Compare
              </button>
            </div>

            {/* Metadata (SKU, Category, Tags) */}
            <div className="pt-6 text-sm text-gray-500 border-t border-gray-200 space-y-2">
              <p>SKU: <span className="text-gray-700 font-medium">{product.sku}</span></p>
              <p>Category: <span className="text-gray-700 font-medium">{product.category}</span></p>
              <p>Tags: <span className="text-gray-700 font-medium">Sofa, Chair, Home, Shop</span></p>
              <div className="flex items-center space-x-2">
                <p>Share:</p>
                <Facebook className="w-5 h-5 cursor-pointer hover:text-primary" />
                <Twitter className="w-5 h-5 cursor-pointer hover:text-primary" />
                <Linkedin className="w-5 h-5 cursor-pointer hover:text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Unchanged) */}
      <div className="border-t border-gray-200 py-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">

          <div className="flex space-x-10 border-b pb-4">
            {['Description', 'Additional Information', 'Reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xl font-medium transition duration-150 ${activeTab === tab
                  ? 'text-gray-900 border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab} {tab === 'Reviews' && `(${product.reviews || 5})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            <TabContent />
          </div>

        </div>
      </div>

      {/* Related Products Section (Dynamic and Clickable) */}
      <div className="py-16 bg-background-light text-center">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map(relatedProduct => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
          <button onClick={goToShop} className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-10 mt-10 transition duration-300 uppercase">
            Show More
          </button>
        </div>
      </div>

      <FeatureStrip />

      {/* Sticky Mobile Add-To-Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 md:hidden flex justify-between items-center animate-slide-up">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">{product.name}</span>
          <span className="font-bold text-gray-900 text-lg">{formattedPrice}</span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={displayStock === 0 || !displayStock}
          className={`font-semibold py-3 px-8 rounded-lg transition duration-300 uppercase ${(displayStock === 0 || !displayStock) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-amber-700 text-white shadow-lg'
            }`}
        >
          {displayStock === 0 || !displayStock ? 'Out of Stock' : 'Add To Cart'}
        </button>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={product.images ? product.images.map(src => ({ src })) : [{ src: mainImageSource }]}
      />
    </>
  );
};

export default ProductDetailPage;