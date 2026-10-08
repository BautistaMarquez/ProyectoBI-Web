/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        magenta: '#E82076',
        purple: '#6C5F91',
        cyan: '#0CAFC3',
        primary: { DEFAULT: '#6C5F91', dark: '#574C77' },
      },
      backgroundImage: {
        'gradient-siig': 'linear-gradient(to right, #E82076, #6C5F91, #0CAFC3)',
      },
    },
  },
  plugins: [],
}
