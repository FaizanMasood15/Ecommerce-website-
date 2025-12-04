// src/App.jsx - FINAL ROUTING IMPLEMENTATION

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage'; // The wrapper for the Home content
import ShopPage from './pages/Shop';

function App() {
  // Use state to manage the current view. Default to 'home'.
  const [currentPage, setCurrentPage] = useState('home'); 

  // Function to navigate to the Shop page
  const goToShop = () => setCurrentPage('shop');

  // Function to navigate to the Home page
  const goToHome = () => setCurrentPage('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <ShopPage />;
      case 'home':
      default:
        // Pass the function down to the HomePage wrapper
        return <HomePage goToShop={goToShop} />; 
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Pass goToHome to the Header so links can use it */}
      <Header goToHome={goToHome} goToShop={goToShop} /> 
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}

export default App;