import React from 'react'

/**
 * Configuration for Tailwind Configuration showcase
 */
const TailwindConfigConfig = {
  title: 'Tailwind Config',
  description: 'Core Tailwind configuration with Agilit-e theme settings',
  usage: 'Extend your tailwind.config.js',
  codeExample: `
const agiliteCore = require('./src/agilite-core/config/tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: agiliteCore.theme,
  plugins: []
}
`,
  notes: 'The configuration includes custom colors, spacing, and other theme settings'
}

export default TailwindConfigConfig 