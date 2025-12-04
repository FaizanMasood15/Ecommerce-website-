// src/components/FeatureStrip.jsx

import React from 'react';
import { Award, Shield, Truck, Headset } from 'lucide-react';

const features = [
  { icon: Award, title: 'High Quality', description: 'crafted from top materials' }, // From Product Comparison.pdf [cite: 201, 202]
  { icon: Shield, title: 'Warranty Protection', description: 'Over 2 years' }, // From Product Comparison.pdf [cite: 203]
  { icon: Truck, title: 'Free Shipping', description: 'Order over 150 $' }, // From Product Comparison.pdf [cite: 204]
  { icon: Headset, title: '24/7 Support', description: 'Dedicated support' }, // From Product Comparison.pdf [cite: 205]
];

const FeatureStrip = () => {
  return (
    // Uses the light background color we defined
    <section className="bg-hero-box py-16 md:py-20"> 
      <div className="container mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4">
              <feature.icon className="w-10 h-10 text-gray-800" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;