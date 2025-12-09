// src/components/HeroSection.jsx (Updated to use imported image)

import React from 'react';
import { images } from '../data/productImages'; 

const HeroSection = ({ goToShop }) => {
  return (
    <div 
        className="relative h-[650px] md:h-[750px] bg-cover bg-center" 
        style={{ 
            backgroundImage: `url(${images.heroBg})`, 
            backgroundPosition: 'right' 
        }}
    >
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 h-full flex items-start md:items-center justify-end">
        <div className="w-full md:w-1/2 lg:w-[500px] p-8 md:p-10 lg:p-14 
                    bg-hero-box 
                    rounded-lg shadow-2xl 
                    translate-y-[-2rem] md:translate-y-[-4rem] 
                    transform
        ">
          <p className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-widest mb-2">
            NEW ARRIVAL
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-4 leading-tight">
            Discover Our New Collection
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-8 max-w-[90%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.
          </p>
          <button 
            onClick={goToShop} 
            className="bg-primary hover:bg-amber-700 text-white font-bold py-4 px-10 
                       transition duration-300 uppercase text-lg"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;