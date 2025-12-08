// src/components/RoomInspiration.jsx (Now Interactive)

import React, { useState } from 'react'; // <-- Import useState
import { ArrowRight } from 'lucide-react'; 

const RoomInspiration = () => {
  // Data for the inspiration gallery
  const rooms = [
    { id: 1, type: 'Bed Room', name: 'Inner Peace', image: 'public/images/Rectangle 24.png' },
    { id: 2, type: 'Dining Room', name: 'Bright Light', image: 'public/images/Rectangle 25.png' },
    { id: 3, type: 'Living Room', name: 'Cozy Space', image: 'public/images/shop.jpg' },
  ];
  
  // State to track the index of the currently visible room (0-indexed)
  const [activeIndex, setActiveIndex] = useState(0); 

  const totalRooms = rooms.length;

  // Handler for the Right Arrow button
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalRooms);
  };
  
  // The room data that is currently visible in the main panel
  const currentRoom = rooms[activeIndex];


  return (
    // Section Container: Uses the custom light background color
    <section className="bg-hero-box py-16 md:py-20"> 
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        
        {/* Main Grid: Text Sidebar and Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Left Column: Text Content and Button (Unchanged) */}
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
          
          {/* Right Column: Image Gallery (Now controlled by activeIndex) */}
          <div className="relative w-full">
            
            {/* The Main Image Display */}
            <div key={currentRoom.id} className="relative">
                <img 
                    src={currentRoom.image} 
                    alt={currentRoom.name}
                    className="w-full h-[500px] object-cover rounded-xl"
                />
                
                {/* Text Overlay Box (Dynamically shows current room details) */}
                <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 p-4 md:p-6 rounded-lg max-w-[250px]">
                    <p className="text-gray-500 text-sm">{currentRoom.id.toString().padStart(2, '0')} — {currentRoom.type}</p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentRoom.name}</h3>
                    {/* Overlay Arrow Button */}
                    <button 
                        onClick={handleNext} // <-- Arrow button uses the next handler
                        className="absolute bottom-0 right-0 p-4 bg-primary hover:bg-amber-700 transition duration-300"
                    >
                        <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Pagination Dots (Now Functional) */}
            <div className="absolute bottom-10 right-4 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 flex space-x-3 mt-4">
              {rooms.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setActiveIndex(index)} // <-- Dot click changes activeIndex
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        activeIndex === index ? 'bg-primary' : 'bg-gray-400 opacity-50 hover:opacity-100'
                    }`}
                />
              ))}
            </div>

            {/* Right Arrow Navigation (Moved outside the card, uses the same handler) */}
            <button 
                onClick={handleNext} // <-- Main Navigation Arrow uses the next handler
                className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full shadow-lg hidden lg:block"
            >
              <ArrowRight className="w-6 h-6 text-gray-900" />
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomInspiration;