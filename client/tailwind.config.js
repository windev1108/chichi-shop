/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         primary: "#1199ab"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
