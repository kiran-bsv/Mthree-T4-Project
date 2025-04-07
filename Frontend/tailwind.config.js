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
  // Define which files should be processed for Tailwind classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom animations configuration
      animation: {
        // Linear movement animation
        linearMove: "linearMove 2s linear infinite",
        // Typing effect animation with blinking cursor
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite" ,
      },
      // Keyframes for custom animations
      keyframes: {
        // Linear movement animation keyframes
        linearMove: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(20vw)" },
        },
        // Typing animation keyframes
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "80%": {
            width: "80%"
          }
        },
        // Blinking cursor animation keyframes
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
  // No additional plugins configured
  plugins: [],
};
