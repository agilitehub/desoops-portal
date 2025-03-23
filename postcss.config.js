// This is the PostCSS configuration file that:
// 1. Processes CSS with Tailwind CSS - transforms Tailwind utility classes into regular CSS
// 2. Adds vendor prefixes to CSS rules using autoprefixer for better browser compatibility
module.exports = {
  plugins: {
    // Process Tailwind CSS classes and generate corresponding CSS
    tailwindcss: {},
    // Add vendor prefixes to CSS rules for cross-browser compatibility
    autoprefixer: {}
  }
}
