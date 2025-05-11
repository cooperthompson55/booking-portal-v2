/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        accent: {
          DEFAULT: '#4A90E2',
          light: '#7EB3F1',
          dark: '#2171CD'
        }
      }
    },
  },
  plugins: [],
};