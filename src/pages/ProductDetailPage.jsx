// src/pages/ProductDetailPage.jsx (UPDATED for React Router useParams)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- IMPORT useParams
import { Share2, Facebook, Twitter, Linkedin, Star, Minus, Plus } from 'lucide-react';
import FeatureStrip from '../components/FeatureStrip';
import ProductCard from '../components/ProductCard';
import { ALL_PRODUCTS } from '../data/products'; 

// --- DUMMY DATA FOR COMPLEX DETAILS ---
const productDetails = {
    'Asgaard sofa': {
        reviews: 5,
        rating: 4.7,
        images: ['/images/asgaard-1.jpg', '/images/asgaard-2.jpg', '/images/asgaard-3.jpg', '/images/asgaard-4.jpg'],
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
    'default': { 
        images: ['/images/default-main.jpg'], 
        colors: [{ name: 'Default', hex: '#B88E2F' }],
        sizes: ['L', 'XL', 'XS'],
        reviews: 1,
        rating: 4.0,
    }
};


const ProductDetailPage = ({ goToProduct, goToShop }) => { // Removed productId from props
  
  // CRITICAL FIX 1: Retrieve the ID from the URL parameter
  const { productId: idParam } = useParams();
  
  // Convert the URL string parameter to a number
  const productId = parseInt(idParam); 
  
  // 1. Find the selected product from the central data source
  const selectedProduct = ALL_PRODUCTS.find(p => p.id === productId);

  let product;
  let productSpecificDetails;

  if (selectedProduct) {
    productSpecificDetails = productDetails[selectedProduct.name] || productDetails.default;
    
    // CRITICAL: Ensure the image used in the default case is the ALL_PRODUCTS image
    product = {
      ...selectedProduct,
      ...productSpecificDetails, 
      sku: selectedProduct.id.toString().padStart(4, '0'),
      category: selectedProduct.description,
      mainImage: selectedProduct.image, 
    };
  } else {
    // Default fallback if product not found (e.g. invalid URL)
    const defaultAsgaard = { 
        id: 100, 
        name: 'Asgaard sofa', 
        price: 250000.00, 
        image: '/images/asgaard-1.jpg', 
        ...productDetails['Asgaard sofa'] 
    };
    product = defaultAsgaard;
    product.mainImage = product.image;
  }
  
  // State for user selections and image source
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');
  // State for the main image source (CRITICAL)
  const [mainImageSource, setMainImageSource] = useState(product.mainImage); 

  // --- CRITICAL FIX 2: useEffect to reset image and state on new product ID ---
  // This hook ensures that when the URL changes (e.g., clicking related product), the component updates.
  useEffect(() => {
    // Reset the main image source to the new product's image path
    setMainImageSource(product.mainImage); 
    
    // Reset selections
    setSelectedColor(product.colors[0].name);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
  }, [idParam, product.mainImage]); // <-- DEPENDS ON THE URL PARAMETER (idParam)

  // 2. Related Products Logic (Now uses the dynamically loaded product)
  const relatedProducts = ALL_PRODUCTS
    .filter(p => p.id !== product.id)
    .sort(() => 0.5 - Math.random()) 
    .slice(0, 4); 
    
  // --- HANDLERS (Unchanged) ---
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${product.name} (Color: ${selectedColor}, Size: ${selectedSize}) to the cart!`);
  };

  const formattedPrice = `Rs. ${product.price.toLocaleString('en-IN')}.00`;
  const ratingStars = [...Array(Math.floor(product.rating || 5))].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary" />);
  
  // Tab Content Renderer (Unchanged)
  const TabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <div className="space-y-4 text-gray-700">
            <p className="mt-4">
              {product.description}
            </p>
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
            {/* Small Images Column (Thumbnail Gallery) - Leave blank for now */}
            <div className="flex flex-col space-y-4">
              {/* If you add more images to your product data, they would go here */}
            </div>
            
            {/* Main Image - Uses the updating mainImageSource state */}
            <div className="flex-grow">
              <img 
                src={mainImageSource} 
                alt={product.name} 
                className="w-full h-auto object-cover rounded-lg" 
              />
            </div>
          </div>
          
          {/* Right Side: Details and Controls (Unchanged) */}
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-medium text-gray-900">{formattedPrice}</p>
            
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-3 text-sm">
                <div className="flex text-primary">
                    {ratingStars}
                </div>
                <span className="text-gray-500 text-sm">|</span>
                <span className="text-gray-500">{product.reviews || 5} Customer Review</span>
            </div>

            <p className="text-gray-700 text-base max-w-lg">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-500">Size</h3>
              <div className="flex space-x-3">
                {product.sizes && product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-10 rounded-lg text-sm font-semibold 
                      ${selectedSize === size ? 'bg-primary text-white' : 'bg-hero-box text-gray-900 hover:bg-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-500">Color</h3>
              <div className="flex space-x-3">
                {product.colors && product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-6 w-6 rounded-full border-2 transition-all duration-150 
                      ${selectedColor === color.name ? 'border-primary' : 'border-transparent hover:border-gray-400'}`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
              
              <div className="flex items-center space-x-2 border border-gray-400 rounded-lg">
                <button onClick={decreaseQuantity} className="p-3 text-lg text-gray-900 hover:bg-gray-100 transition duration-150">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
                <button onClick={increaseQuantity} className="p-3 text-lg text-gray-900 hover:bg-gray-100 transition duration-150">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button onClick={handleAddToCart} className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-10 rounded-lg transition duration-300 uppercase">
                Add To Cart
              </button>

              <button className="border border-gray-400 text-gray-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 uppercase flex items-center">
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
      
      {/* Tabs Section */}
      <div className="border-t border-gray-200 py-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          
          <div className="flex space-x-10 border-b pb-4">
            {['Description', 'Additional Information', 'Reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xl font-medium transition duration-150 ${
                  activeTab === tab 
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
                    goToProduct={goToProduct} 
                  /> 
                ))}
            </div>
            <button onClick={goToShop} className="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-10 mt-10 transition duration-300 uppercase">
                Show More
            </button>
        </div>
      </div>
      
      <FeatureStrip />
    </>
  );
};

export default ProductDetailPage;