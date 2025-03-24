/** @type {import('tailwindcss').Config} */
const agiliteCore = require('../../config/tailwind.config')
const merge = require('lodash/merge')

/**
 * Boilerplate App Tailwind Configuration
 * 
 * This file allows users to override or extend the core Tailwind configuration
 * without modifying the files in the agilite-core directory.
 * 
 * This is the right place for app-specific customizations.
 */
module.exports = {
  // Inherit content configuration from parent
  content: ['../src/**/*.{js,jsx,ts,tsx}'],
  
  // Keep using class-based dark mode
  darkMode: 'class',
  
  // Extend the core theme with your app-specific customizations
  theme: {
    // Use merge to combine the configurations
    ...merge({}, agiliteCore.theme, {
      extend: {
        // Add your custom extensions here
        colors: {
          // Example: Add a new color or override an existing one
          'custom-color': '#7e22ce',
        },
        // Add other customizations here:
        // fontFamily, spacing, etc.
      },
    }),
  },
  
  // Add any additional plugins your app needs
  plugins: [
    // Example: Additional plugins can be added here
  ],
} 