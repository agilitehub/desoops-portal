/** @type {import('tailwindcss').Config} */
const agiliteCore = require('../../agilite-core/config/tailwind.config')
const merge = require('lodash/merge')

/**
 * DeSoOps Tailwind Configuration
 * Extends the core configuration with DeSo-specific theme settings
 */
module.exports = {
  // Inherit content configuration from parent
  content: ['../../../src/**/*.{js,jsx,ts,tsx}'],
  
  // Keep using class-based dark mode
  darkMode: 'class',
  
  // Extend the core theme with your app-specific customizations
  theme: {
    // Use merge to combine the configurations
    ...merge({}, agiliteCore.theme, {
      extend: {
        // Add your custom extensions here
        colors: {
          'deso': {
            'primary': '#134292',    // Torea Bay
            'secondary': '#234B8F',   // More vibrant blue
            'accent': '#FF7F50',     // Coral
            'gray': '#737373',       // Dove Gray
            'light': '#60B6FF',      // Brighter Malibu
            'blue': '#2066D6',       // Brighter Fun Blue
            'dodger': '#1E96FF',     // Brighter Dodger Blue
            'azure': '#0091FF',      // Brighter Azure
            'green': '#4CAF50',      // Chateau Green
            'dark': '#2C3D52',       // More colorful dark
          },
          // Override agilite-core colors
          'agilite-red': '#134292',      // Override with DeSo primary
          'agilite-black': '#2C3D52',    // Override with more colorful dark
          // Set primary theme colors
          primary: '#134292',        // Torea Bay
          secondary: '#234B8F',      // More vibrant blue
          accent: '#FF7F50',         // Coral
        },
        backgroundColor: theme => ({
          ...theme('colors'),
          'base': '#FFFFFF',
          'base-dark': '#2C3D52',
        }),
        textColor: theme => ({
          ...theme('colors'),
          'base': '#1F1F1F',
          'base-dark': '#FFFFFF',
        }),
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