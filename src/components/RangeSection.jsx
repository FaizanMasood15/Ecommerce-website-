// src/components/RangeSection.jsx

import React from 'react';

const RangeSection = () => {
  // Data for the range categories (Living, Dining, Bedroom)
  const categories = [
    { name: 'Dining', image: '/images/dinning.png' },
    { name: 'Living', image: '/images/living.png' },
    { name: 'Bedroom', image: '/images/bedroom.png' },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 text-center">
        
        {/* Title and Description */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Browse The Range
        </h2>
        <p className="text-gray-500 mb-10 md:mb-16 max-w-xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* Categories Grid (Fully Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col items-center">
              
              {/* Image Container */}
              <div className="h-96 w-full overflow-hidden rounded-lg mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  // Responsive and centered image fit
                  className="w-full h-full object-cover transition duration-500 ease-in-out hover:scale-105"
                />
              </div>
              
              {/* Category Name */}
              <h3 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RangeSection;