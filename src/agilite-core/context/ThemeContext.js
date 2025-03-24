import React, { createContext, useContext, useEffect, useState } from 'react'

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext 