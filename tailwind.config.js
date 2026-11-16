/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  // The app has one (light) look; "class" stops the web preview following the browser's theme.
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
