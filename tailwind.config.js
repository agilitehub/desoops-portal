/** @type {import('tailwindcss').Config} */
const agiliteCore = require('./src/agilite-core/config/tailwind.config')

// This is the Tailwind CSS configuration file that:
// 1. Processes all JS/JSX/TS/TSX files in the src directory for Tailwind classes
// 2. Enables dark mode using class-based approach (using 'dark' class)
// 3. Uses theme settings imported from agilite-core package
// 4. Can be extended with additional plugins as needed
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: agiliteCore.theme,
  plugins: []
}
