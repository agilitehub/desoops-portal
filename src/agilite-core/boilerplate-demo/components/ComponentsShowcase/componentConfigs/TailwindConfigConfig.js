import React from 'react'

/**
 * Configuration for Tailwind Configuration showcase
 */
const TailwindConfigConfig = {
  title: "Tailwind Configuration",
  description: "The Agilit-e Core library includes a custom Tailwind configuration with predefined colors, animations, and utilities.",
  usage: "// In your tailwind.config.js file",
  codeExample: `
const agiliteCore = require('./src/agilite-core/config/tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: agiliteCore.theme,
  plugins: []
}
`,
  notes: "The core Tailwind configuration includes Agilit-e brand colors, custom animations, and other useful theme extensions."
}

export default TailwindConfigConfig 