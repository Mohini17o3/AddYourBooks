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
      backgroundImage : {
          radialPurple1 : 'radial-gradient(#aa92d1  , #582e8c)'
      }, 
      fontFamily: {
        arizonia : ['Arizonia' , 'cursive'],
        zeyada : ['Zeyada' , 'cursive'],
      }, 
    },
  },
  plugins: [],
}

