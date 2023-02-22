/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         primary: "#1199ab"
      },
      animation: {
        show: 'show 0.6s',
      },
      keyframes: {
        show: {
          '0%, 49.99%': { opacity: 0, zIndex: 1 },
          '50%, 100%': { opacity: 1 , zIndex: 5 },
        }
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
