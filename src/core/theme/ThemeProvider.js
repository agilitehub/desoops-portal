import React, { createContext, useContext, useEffect } from 'react'
import { ConfigProvider } from 'antd'
import { lightAntdTokens } from './antd-tokens'

const ThemeContext = createContext(undefined)

const OVERRIDE_KEY = 'themeUserOverride'

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    try {
      localStorage.removeItem(OVERRIDE_KEY)
    } catch {}
  }, [])

  return (
    <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: () => {} }}>
      <ConfigProvider
        theme={{
          token: lightAntdTokens,
        }}
        modal={{
          centered: true
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
