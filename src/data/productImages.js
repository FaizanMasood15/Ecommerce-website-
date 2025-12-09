// src/data/productImages.js

// ------------------------------------
// 1. PRODUCT IMAGES (Based on your 'ImagesX.png' file names)
// ------------------------------------
import prod1 from '/images/Images1.png';
import prod2 from '/images/Images2.png';
// NOTE: Must use the exact file name (including the space)
import prod3 from '/images/Images 3.png'; 
import prod4 from '/images/Images4.png';
import prod5 from '/images/Images5.png';
import prod6 from '/images/Images6.png';
import prod7 from '/images/Images7.png';
import prod8 from '/images/Images8.png';

// ------------------------------------
// 2. DECORATIVE & SPECIAL IMAGES (Based on previous conversation)
// ------------------------------------
import heroBg from '/images/hero.png'; 
import shopBanner from '/images/shop.jpg';
import room1 from '/images/Images4.png';
import room2 from '/images/Images4.png';
import room3 from '/images/Images4.png';

// Collage images (Assuming previous names)
import collage1 from '/images/Images4.png';
import collage2 from '/images/Images4.png';
import collage3 from '/images/Images4.png';
import collage4 from '/images/Images4.png';
import collage5 from '/images/Images4.png';
import collage6 from '/images/Images4.png';
import collage7 from '/images/Images4.png';

// Asgaard Sofa Detail Images (for the hardcoded example)
import asgaard1 from '/images/Images4.png'; 
import asgaard2 from '/images/Images4.png';
import asgaard3 from '/images/Images4.png';
import asgaard4 from '/images/Images4.png';
import defaultMain from '/images/Images4.png'; // Default fallback image


// Group and export all image assets
export const images = {
    // Products (Indexed by ID)
    1: prod1, 2: prod2, 3: prod3, 4: prod4, 
    5: prod5, 6: prod6, 7: prod7, 8: prod8,

    // Decorative Assets
    heroBg,
    shopBanner,
    room1, room2, room3,
    collage1, collage2, collage3, collage4, collage5, collage6, collage7,

    // Product Detail Page Assets
    asgaard1, asgaard2, asgaard3, asgaard4,
    defaultMain,
};