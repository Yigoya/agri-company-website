/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8cba0',
          300: '#d4a86a',
          400: '#c48d44',
          500: '#a67332',
          600: '#8b5c28',
          700: '#704824',
          800: '#5c3b22',
          900: '#4d3220',
        },
        sage: {
          50: '#f6f7f4',
          100: '#e3e7dc',
          200: '#c7cfba',
          300: '#a4b192',
          400: '#849571',
          500: '#697b57',
          600: '#516144',
          700: '#404c37',
          800: '#353e2f',
          900: '#2e3629',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
