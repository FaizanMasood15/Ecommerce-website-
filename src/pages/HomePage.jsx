// src/pages/HomePage.jsx

import React from 'react';
import HeroSection from '../components/HeroSection';
import RangeSection from '../components/RangeSection';
import ProductsSection from '../components/ProductsSection';
import RoomInspiration from '../components/RoomInspiration';
import FurnitureCollage from '../components/FurnitureCollage';
import FeatureStrip from '../components/FeatureStrip'; // Feature strip is used on Home page too

// Accept the routing function as a prop
const HomePage = ({ goToShop }) => {
  return (
    <>
      <HeroSection />
      <RangeSection />
      {/* Pass the routing function here */}
      <ProductsSection goToShop={goToShop} />
      <RoomInspiration />
      <FurnitureCollage />
      <FeatureStrip /> {/* It is near the footer on the Home Page samples */}
    </>
  );
};

export default HomePage;