// src/components/FurnitureCollage.jsx

import React from 'react';

const images = [
  { id: 1, src: 'public/images/f1.png', alt: 'Shelf', size: 'h-84 col-span-1 row-span-2' }, // Tall left
  { id: 2, src: 'public/images/f2.png', alt: 'Laptop Desk', size: 'h-48 col-span-2 row-span-1' }, // Wide top
  { id: 3, src: 'public/images/f3.png', alt: 'Armchair', size: 'h-48 col-span-1 row-span-1' }, // Middle-left
  { id: 4, src: 'public/images/f4.png', alt: 'Dining Table', size: 'h-64 col-span-2 row-span-2' }, // Large middle
  { id: 5, src: 'public/images/f5.png', alt: 'Bedroom', size: 'h-72 col-span-2 row-span-2' }, // Large right
  { id: 6, src: 'public/images/f6.png', alt: 'Small Vase', size: 'h-32 col-span-1 row-span-1' }, // Bottom right
  { id: 7, src: 'public/images/f7.png', alt: 'Kitchen Shelf', size: 'h-64 col-span-1 row-span-2' }, // Far bottom right
    { id: 7, src: 'public/images/f7.png', alt: 'Kitchen Shelf', size: 'h-64 col-span-1 row-span-2' }, // Far bottom right
  { id: 5, src: 'public/images/f5.png', alt: 'Bedroom', size: 'h-82 col-span-2 row-span-4' }, // Large right

];
const FurnitureCollage = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 text-center">
        
        {/* Title and Hashtag (Updated for your name) */}
        <p className="text-gray-500 mb-2">Share your setup with</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-16">
          FaizanButtFurniture
        </h2>

        {/* Image Grid Container - Using CSS Grid for complex layout */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 auto-rows-min">
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`overflow-hidden rounded-lg ${img.size}`} // Use dynamic sizing
            >
              <img
                src={img.src}
                alt={img.alt}
                // Object-cover ensures images fill their dynamic grid box without distortion
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FurnitureCollage;