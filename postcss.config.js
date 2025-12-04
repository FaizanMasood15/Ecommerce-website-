// postcss.config.js

// 1. Explicitly import the necessary modules.
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  // 2. Export them as an array of plugins.
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
};