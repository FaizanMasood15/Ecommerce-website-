// src/App.jsx - Implementing React Router

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Page Components
import HomePage from './pages/HomePage';
import ShopPage from './pages/Shop';
import ProductDetailPage from './pages/ProductDetailPage';

// Main App Component (Responsible for layout and context)
function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false); 
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // We define the layout wrapper here
  const Layout = () => {
    // useNavigate is used for programmatic navigation (like pushing a button)
    const navigate = useNavigate();

    // These functions now use the router's navigate hook
    const goToShop = () => navigate('/shop');
    const goToHome = () => navigate('/');
    const goToProduct = (id) => navigate(`/shop/${id}`);

    return (
      <div className="flex flex-col min-h-screen">
        {/* Header needs the navigation functions and cart toggle */}
        <Header 
          goToHome={goToHome} 
          goToShop={goToShop} 
          toggleCart={toggleCart} 
        /> 
        
        <main className="flex-grow">
          {/* Define all possible URL paths here */}
          <Routes>
            <Route 
              path="/" 
              element={<HomePage goToShop={goToShop} goToProduct={goToProduct} />} 
            />
            <Route 
              path="/shop" 
              element={<ShopPage goToProduct={goToProduct} />} 
            />
            {/* Dynamic URL segment (:productId) allows loading specific products */}
            <Route 
              path="/shop/:productId" 
              element={<ProductDetailPage goToProduct={goToProduct} goToShop={goToShop} />} 
            />
            <Route 
              path="*" 
              element={<h1 className="text-center py-20 text-3xl">404: Page Not Found</h1>} 
            />
          </Routes>
        </main>

        <Footer />
        
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  };

  return (
    <CartProvider> 
        {/* BrowserRouter is the container for the entire router setup */}
        <Router>
            <Layout />
        </Router>
    </CartProvider>
  );
}

export default App;