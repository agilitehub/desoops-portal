import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Context for managing theme state across the application
 * @type {React.Context<{darkMode: boolean, toggleDarkMode: () => void}>}
 */
const ThemeContext = createContext()

// Helper function to determine initial dark mode state
const getInitialDarkMode = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false
  
  // Check localStorage first
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme === 'dark'
  }
  
  // Then check system preference
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Provider component that manages theme state
 * Handles system preference detection and localStorage persistence
 * 
 * @component
 * @example
 * // Wrap your app with ThemeProvider
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider = ({ children }) => {
  // Initialize darkMode based on localStorage or system preference
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)
  
  // Apply theme class to document and update localStorage when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = React.useCallback(() => {
    setDarkMode(!darkMode)
  }, [darkMode])

  const value = React.useMemo(() => ({
    darkMode,
    toggleDarkMode
  }), [darkMode, toggleDarkMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

ThemeProvider.propTypes = {
  /** Child components that will have access to the theme context */
  children: PropTypes.node.isRequired
}

/**
 * Hook to access the theme context
 * @returns {{darkMode: boolean, toggleDarkMode: () => void}} Theme context value
 * @throws {Error} If used outside of ThemeProvider
 * 
 * @example
 * const MyComponent = () => {
 *   const { darkMode, toggleDarkMode } = useTheme();
 *   return (
 *     <button onClick={toggleDarkMode}>
 *       Current theme: {darkMode ? 'Dark' : 'Light'}
 *     </button>
 *   );
 * };
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext 