/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
