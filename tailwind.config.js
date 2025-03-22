/** @type {import('tailwindcss').Config} */
const agiliteCore = require('./src/agilite-core/config/tailwind.config')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: agiliteCore.theme,
  plugins: []
}
