/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#B88E2F', 
        'secondary-accent': '#1B5E20',
        'sale-red': '#E57373', 
        'background-light': '#F4F5F7', 
        'hero-box': '#F9F1E7', // Use clean 6-digit hex
        'my-custom-color': '#fff3e3', // Use clean 6-digit hex
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      }
    },
  },
  plugins: [],
}