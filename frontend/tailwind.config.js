/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        magenta: '#E82076',
        purple: '#6C5F91',
        cyan: '#0CAFC3',
      },
      backgroundImage: {
        'gradient-siig': 'linear-gradient(to right, #E82076, #6C5F91, #0CAFC3)',
      },
    },
  },
  plugins: [],
}
