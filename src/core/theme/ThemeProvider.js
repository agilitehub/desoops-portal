import React, { createContext, useContext, useEffect, useState } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { darkAntdTokens, lightAntdTokens } from './antd-tokens'

const ThemeContext = createContext(undefined)

const OVERRIDE_KEY = 'themeUserOverride'

function readUserOverride() {
  try {
    const choice = localStorage.getItem(OVERRIDE_KEY)
    if (choice === 'light' || choice === 'dark') return choice
  } catch {}
  return null
}

function computeDarkMode() {
  const override = readUserOverride()
  if (override === 'dark') return true
  if (override === 'light') return false
  return false
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => (typeof window === 'undefined' ? false : computeDarkMode()))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (readUserOverride() == null) {
        setDarkMode(false)
      }
    }
    mq.addEventListener('change', onSystemChange)
    return () => mq.removeEventListener('change', onSystemChange)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev
      try {
        localStorage.setItem(OVERRIDE_KEY, next ? 'dark' : 'light')
      } catch {}
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: darkMode ? darkAntdTokens : lightAntdTokens,
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
