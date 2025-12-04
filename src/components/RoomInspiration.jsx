// src/components/RoomInspiration.jsx

import React from 'react';
import { ArrowRight } from 'lucide-react'; // Icon for navigation

const RoomInspiration = () => {
  // Dummy data for the inspiration gallery
  const rooms = [
    { id: 1, type: 'Bed Room', name: 'Inner Peace', image: 'public/images/Rectangle 24.png' },
    { id: 2, type: 'Dining Room', name: 'Bright Light', image: 'public/images/Rectangle 25.png' },
    { id: 3, type: 'Living Room', name: 'Cozy Space', image: 'public/images/rect.png' },
  ];

  return (
    // Section Container: Uses the custom light background color
    <section className="bg-hero-box py-16 md:py-20"> 
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* Main Grid: 1 column on mobile, 2 columns on large screens for layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Left Column: Text Content and Button */}
          <div className="lg:pr-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 max-w-sm">
              50+ Beautiful rooms inspiration
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Our designer already made a lot of beautiful prototype of rooms that inspire you
            </p>
            {/* Primary Button */}
            <button 
              className="bg-primary hover:bg-amber-700 text-white font-bold py-3 px-8 
                         transition duration-300 uppercase"
            >
              Explore More
            </button>
          </div>
          
          {/* Right Column: Image Gallery (Simulating a slider/scroller) */}
          <div className="relative w-full overflow-hidden">
            <div className="flex space-x-6 md:space-x-8 lg:space-x-10 overflow-x-auto snap-x snap-mandatory">
              
              {/* Main Room Card (Example: Inner Peace) */}
              <div key={rooms[0].id} className="snap-center flex-shrink-0 w-full md:w-[70%] lg:w-[450px] relative">
                <img 
                  src="public/images/Rectangle 24.png" // Placeholder for the main featured image
                  alt={rooms[0].name}
                  className="w-full h-[500px] object-cover rounded-xl"
                />
                
                {/* Text Overlay Box */}
                <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-4 md:p-6 rounded-lg max-w-[250px]">
                  <p className="text-gray-500 text-sm">{rooms[0].id.toString().padStart(2, '0')} — {rooms[0].type}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{rooms[0].name}</h3>
                  {/* Overlay Arrow Button */}
                  <a href="#" className="absolute bottom-0 right-0 p-4 bg-primary hover:bg-amber-700 transition duration-300">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>

              {/* Secondary Images (Hidden on small screens, simulate scrolling) */}
              {rooms.slice(1).map(room => (
                <div key={room.id} className="snap-center flex-shrink-0 w-full md:w-[70%] lg:w-[450px] relative">
                    <img 
                      src={room.image}
                      alt={room.name}
                      className="w-full h-[500px] object-cover rounded-xl"
                    />
                     <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-4 md:p-6 rounded-lg max-w-[250px]">
                      <p className="text-gray-500 text-sm">{room.id.toString().padStart(2, '0')} — {room.type}</p>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                      <a href="#" className="absolute bottom-0 right-0 p-4 bg-primary hover:bg-amber-700 transition duration-300">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </a>
                    </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots (Simulated) */}
            <div className="absolute bottom-10 right-4 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 flex space-x-3 mt-4">
              <span className="h-3 w-3 rounded-full bg-primary"></span> {/* Active dot */}
              <span className="h-3 w-3 rounded-full bg-gray-400 opacity-50 hover:opacity-100 cursor-pointer"></span>
              <span className="h-3 w-3 rounded-full bg-gray-400 opacity-50 hover:opacity-100 cursor-pointer"></span>
            </div>

            {/* Right Arrow Navigation (Simulated) */}
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full shadow-lg hidden lg:block">
              <ArrowRight className="w-6 h-6 text-gray-900" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomInspiration;