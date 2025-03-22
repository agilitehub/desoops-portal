// Component exports
export { default as Logo } from './components/ui/Logo'
export { default as ThemeToggle } from './components/ui/ThemeToggle'
export { default as BackgroundEffect } from './components/ui/BackgroundEffect'

// Context exports
export { default as ThemeContext, ThemeProvider, useTheme } from './context/ThemeContext'

// Note: Core styles are imported directly in the main src/index.js file
// This allows proper CSS cascade ordering while ensuring Tailwind directives
// are available in both files 