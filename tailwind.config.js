/** @type {import('tailwindcss').Config} */
const boilerplateConfig = require('./src/agilite-core/boilerplate-demo/config/tailwind.config')

// This is the Tailwind CSS configuration file that:
// 1. Processes all JS/JSX/TS/TSX files in the src directory for Tailwind classes
// 2. Enables dark mode using class-based approach (using 'dark' class)
// 3. Uses theme settings imported from the boilerplate config, which extends agilite-core
// 4. Can be extended with additional plugins as needed
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: boilerplateConfig.theme,
  plugins: boilerplateConfig.plugins || []
}
