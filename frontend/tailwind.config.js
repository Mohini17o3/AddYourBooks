/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
         headingFont :"#33006F"
      } , 
      fontFamily: {
        arizonia : ['Arizonia' , 'cursive'],
        zeyada : ['Zeyada' , 'cursive'],
      }, 
    },
  },
  plugins: [],
}

