// src/data/products.js (Updated to use imported image assets)

import { images } from './productImages'; // <-- Import the centralized images

export const ALL_PRODUCTS = [
  // PRODUCTS 1-8 (Using unique imports)
  { id: 1, name: 'Syltherine', description: 'Stylish cafe chair', price: '2.500.000', originalPrice: '3.500.000', discount: 30, isNew: false, image: images[1] },
  { id: 2, name: 'Leviosa', description: 'Stylish cafe chair', price: '2.500.000', originalPrice: '3.000.000', discount: 30, isNew: false, image: images[2] },
  { id: 3, name: 'Lolito', description: 'Luxury big sofa', price: '7.000.000', originalPrice: '14.000.000', discount: 50, isNew: false, image: images[3] },
  { id: 4, name: 'Respira', description: 'Outdoor bar table and stool', price: '500.000', originalPrice: null, discount: 0, isNew: true, image: images[4] },
  { id: 5, name: 'Grifo', description: 'Night lamp', price: '1.500.000', originalPrice: null, discount: 0, isNew: false, image: images[5] },
  { id: 6, name: 'Muggo', description: 'Small mug', price: '150.000', originalPrice: null, discount: 0, isNew: true, image: images[6] },
  { id: 7, name: 'Pingky', description: 'Cute bed set', price: '7.000.000', originalPrice: '14.000.000', discount: 50, isNew: false, image: images[7] },
  { id: 8, name: 'Potty', description: 'Minimalist flower pot', price: '500.000', originalPrice: null, discount: 0, isNew: true, image: images[8] },
  
  // PRODUCTS 9-16 (Reusing images based on your pattern)
  { id: 9, name: 'Magnolia', description: 'Modern design sofa', price: '1.000.000', originalPrice: null, discount: 0, isNew: false, image: images[2] },
  { id: 10, name: 'Aurora', description: 'New collection item', price: '2.200.000', originalPrice: null, discount: 0, isNew: true, image: images[3] },
  { id: 11, name: 'Fiona', description: 'Sale item', price: '4.000.000', originalPrice: '8.000.000', discount: 50, isNew: false, image: images[4] },
  { id: 12, name: 'Zelia', description: 'Outdoor chair', price: '700.000', originalPrice: null, discount: 0, isNew: false, image: images[5] },
  { id: 13, name: 'Cosmo', description: 'Cute bed set', price: '4.000.000', originalPrice: '8.000.000', discount: 50, isNew: false, image: images[8] },
  { id: 14, name: 'Terra', description: 'Plant pot set', price: '700.000', originalPrice: null, discount: 0, isNew: false, image: images[8] },
  { id: 15, name: 'Luna', description: 'Night lamp', price: '4.000.000', originalPrice: '8.000.000', discount: 50, isNew: false, image: images[5] },
  { id: 16, name: 'Willow', description: 'Small mug set', price: '700.000', originalPrice: null, discount: 0, isNew: false, image: images[8] },

  // PRODUCTS 17-32 (Reusing images based on your pattern)
  { id: 17, name: 'Product 17', description: 'Placeholder product', price: '1.200.000', originalPrice: null, discount: 0, isNew: false, image: images[8] },
  { id: 18, name: 'Product 18', description: 'Placeholder product', price: '3.100.000', originalPrice: null, discount: 0, isNew: false, image: images[8] },
  { id: 19, name: 'Product 19', description: 'Placeholder product', price: '6.500.000', originalPrice: '13.000.000', discount: 50, isNew: false, image: images[5] },
  { id: 20, name: 'Product 20', description: 'Placeholder product', price: '450.000', originalPrice: null, discount: 0, isNew: true, image: images[3] },
  { id: 21, name: 'Product 21', description: 'Placeholder product', price: '1.700.000', originalPrice: null, discount: 0, isNew: false, image: images[3] },
  { id: 22, name: 'Product 22', description: 'Placeholder product', price: '180.000', originalPrice: null, discount: 0, isNew: true, image: images[5] },
  { id: 23, name: 'Product 23', description: 'Placeholder product', price: '7.500.000', originalPrice: '15.000.000', discount: 50, isNew: false, image: images[8] },
  { id: 24, name: 'Product 24', description: 'Placeholder product', price: '550.000', originalPrice: null, discount: 0, isNew: true, image: images[3] },
  { id: 25, name: 'Product 25', description: 'Placeholder product', price: '1.100.000', originalPrice: null, discount: 0, isNew: false, image: images[5] },
  { id: 26, name: 'Product 26', description: 'Placeholder product', price: '2.500.000', originalPrice: null, discount: 0, isNew: true, image: images[5] },
  { id: 27, name: 'Product 27', description: 'Placeholder product', price: '4.500.000', originalPrice: '9.000.000', discount: 50, isNew: false, image: images[3] },
  { id: 28, name: 'Product 28', description: 'Placeholder product', price: '600.000', originalPrice: null, discount: 0, isNew: false, image: images[5] },
  { id: 29, name: 'Product 29', description: 'Placeholder product', price: '4.100.000', originalPrice: '8.200.000', discount: 50, isNew: false, image: images[8] },
  { id: 30, name: 'Product 30', description: 'Placeholder product', price: '800.000', originalPrice: null, discount: 0, isNew: false, image: images[5] },
  { id: 31, name: 'Product 31', description: 'Placeholder product', price: '4.200.000', originalPrice: '8.400.000', discount: 50, isNew: false, image: images[5] },
  { id: 32, name: 'Product 32', description: 'Placeholder product', price: '750.000', originalPrice: null, discount: 0, isNew: false, image: images[8] },
];