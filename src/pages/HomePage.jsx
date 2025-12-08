// src/pages/HomePage.jsx - Updated to pass goToProduct

import React from 'react';
import HeroSection from '../components/HeroSection';
import RangeSection from '../components/RangeSection';
import ProductsSection from '../components/ProductsSection';
import RoomInspiration from '../components/RoomInspiration';
import FurnitureCollage from '../components/FurnitureCollage';
import FeatureStrip from '../components/FeatureStrip';

// Accept both routing functions as props
const HomePage = ({ goToShop, goToProduct }) => {
  return (
    <>
      <HeroSection goToShop={goToShop} goToProduct={goToProduct}/>
      <RangeSection />
      {/* Pass both routing functions here */}
      <ProductsSection goToShop={goToShop} goToProduct={goToProduct} />
      <RoomInspiration />
      <FurnitureCollage />
      <FeatureStrip />
    </>
  );
};

export default HomePage;