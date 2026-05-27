/** @type {import('tailwindcss').Config} */
const path = require('path')

module.exports = {
  content: [path.join(__dirname, 'src/**/*.{js,jsx}')],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px',
    },
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-muted': 'rgb(var(--color-surface-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-input': 'rgb(var(--color-border-input) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        placeholder: 'rgb(var(--color-placeholder) / <alpha-value>)',
        'ring-offset': 'rgb(var(--color-ring-offset) / <alpha-value>)',
        'overlay-hover': 'var(--color-overlay-hover)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        'deso-blue': {
          DEFAULT: '#188EFF',
          dark: '#4B9CD3',
          deep: '#1C4B73',
        },
        'deso-orange': {
          DEFAULT: '#FF7F50',
          light: '#FFA07A',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        loginFloatUpLeft: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(var(--login-rotate, -10deg)) scale(1)' },
          '50%': { transform: 'translate(-24px, -32px) rotate(calc(var(--login-rotate, -10deg) + 3deg)) scale(1.02)' },
        },
        loginFloatDown: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(var(--login-rotate, 8deg)) scale(1)' },
          '50%': { transform: 'translate(20px, 28px) rotate(calc(var(--login-rotate, 8deg) + 4deg)) scale(1.02)' },
        },
        loginFloatScale: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(var(--login-rotate, 0deg)) scale(1)' },
          '50%': { transform: 'translate(14px, -18px) rotate(calc(var(--login-rotate, 0deg) + 3deg)) scale(1.03)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0)' },
          '20%, 60%': { transform: 'rotate(15deg)' },
          '40%, 80%': { transform: 'rotate(-15deg)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'login-float-up-left': 'loginFloatUpLeft 24s ease-in-out infinite',
        'login-float-down': 'loginFloatDown 22s ease-in-out infinite',
        'login-float-scale': 'loginFloatScale 20s ease-in-out infinite',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}
