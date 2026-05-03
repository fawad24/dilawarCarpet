/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
       colors: {
        lightYellow: "#fefae0",
        lightGrey:"#d9d9d9",
      },
    },
  },
  plugins: [],
}
