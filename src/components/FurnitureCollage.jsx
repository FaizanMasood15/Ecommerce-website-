// src/components/FurnitureCollage.jsx

import React from 'react';

const leftColumn = [
  { id: 1, src: '/images/f1.png', alt: 'Shelf', size: 'h-[280px] md:h-[360px]' },
  { id: 2, src: '/images/f6.png', alt: 'Small Vase', size: 'h-[220px] md:h-[280px]' },
];

const middleColumn = [
  { id: 3, src: '/images/f2.png', alt: 'Laptop Desk', size: 'h-[150px] md:h-[190px]' },
  { id: 4, src: '/images/f4.png', alt: 'Dining Table', size: 'h-[240px] md:h-[330px]' },
];

const rightColumn = [
  { id: 5, src: '/images/f3.png', alt: 'Armchair', size: 'h-[150px] md:h-[190px]' },
  { id: 6, src: '/images/f5.png', alt: 'Bedroom', size: 'h-[190px] md:h-[255px]' },
  { id: 7, src: '/images/f7.png', alt: 'Kitchen Shelf', size: 'h-[160px] md:h-[220px]' },
];

const FurnitureCollage = () => {
  const renderCard = (img) => (
    <div
      key={img.id}
      className={`${img.size} overflow-hidden rounded-xl bg-stone-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]`}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  );

  return (
    <section className="py-16 md:py-24 bg-[#f5f5f5]">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 text-center">
        <p className="text-gray-500 text-sm md:text-base mb-1">Share your setup with</p>
        <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[0.06em] text-[#0b1f47] mb-10 md:mb-14">
          Faizan Masood 15
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5 text-left">
          <div className="space-y-4 md:space-y-5 lg:col-span-2">
            {leftColumn.map(renderCard)}
          </div>

          <div className="space-y-4 md:space-y-5 lg:col-span-5">
            {middleColumn.map(renderCard)}
          </div>

          <div className="space-y-4 md:space-y-5 lg:col-span-5">
            {rightColumn.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureCollage;
