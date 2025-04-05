// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        linearMove: "linearMove 2s linear infinite",
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite" ,
      },
      keyframes: {
        linearMove: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(20vw)" },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "80%": {
            width: "80%"
          }
        },
        blink: {
          "50%": {
            borderColor: "transparent"
          },
          "80%": {
            borderColor: "white"
          }
        }
        
      },
    },
  },
  plugins: [],
};
