// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';

// Page Components
import HomePage from './pages/HomePage';
import ShopPage from './pages/Shop';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ReturnsPage from './pages/ReturnsPage';

// Cart & Checkout
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderDetailPage from './pages/OrderDetailPage';
import GuestOrderConfirmationPage from './pages/GuestOrderConfirmationPage';

// User Account
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

// Admin
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCouponManager from './pages/AdminCouponManager';
import AdminCategoryManager from './pages/AdminCategoryManager';

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const goToShop = () => navigate('/shop');
    const goToHome = () => navigate('/');
    const goToProduct = (id) => navigate(`/shop/${id}`);
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && (
          <Header
            goToHome={goToHome}
            goToShop={goToShop}
            toggleCart={toggleCart}
          />
        )}

        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage goToShop={goToShop} goToProduct={goToProduct} />} />
            <Route path="/shop" element={<ShopPage goToProduct={goToProduct} />} />
            <Route path="/shop/:productId" element={<ProductDetailPage goToProduct={goToProduct} goToShop={goToShop} toggleCart={toggleCart} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/returns" element={<ReturnsPage />} />

            {/* Cart (no auth required) */}
            <Route path="/cart" element={<CartPage />} />

            {/* Checkout & Place Order — public (guest checkout supported) */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/place-order" element={<PlaceOrderPage />} />

            {/* Guest order confirmation (public — no account needed) */}
            <Route path="/guest-order/:id" element={<GuestOrderConfirmationPage />} />

            {/* Protected: Authenticated Users */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/orders" element={<OrderHistoryPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Route>

            {/* Protected: Admin Only */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductListPage />} />
              <Route path="/admin/product/:id/edit" element={<AdminProductEditPage />} />
              <Route path="/admin/orders" element={<AdminOrderListPage />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="/admin/coupons" element={<AdminCouponManager />} />
              <Route path="/admin/categories" element={<AdminCategoryManager />} />
            </Route>

            <Route path="*" element={<h1 className="text-center py-20 text-3xl">404: Page Not Found</h1>} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      </div>
    );
  };

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Layout />
      </Router>
    </CartProvider>
  );
}

export default App;
