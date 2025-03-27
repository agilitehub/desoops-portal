/**
 * Core Tailwind configuration for Agilit-e design system
 * This can be imported and extended by the parent application's tailwind config
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF3030', // Lighter version of the bright red from logo
          DEFAULT: '#E30613', // Exact bright red from Agilit-e logo
          dark: '#C00510' // Darker version of the logo red
        },
        secondary: {
          light: '#768595', // Lighter version of the slate gray
          DEFAULT: '#4A545E', // Slate gray from the Agilit-e logo text
          dark: '#303740' // Darker version of the slate gray
        },
        // Additional brand colors
        'agilite-red': '#E30613',
        'agilite-black': '#151515',
        'agilite-slate': '#1E293B',
        'agilite-grey': {
          light: '#E2E8F0',
          DEFAULT: '#718096',
          dark: '#4A5568'
        },
        'agilite-grey-light': '#F5F5F5'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'slow-pulse': 'slow-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slow-pulse-delay': 'slow-pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite 4s',
        'slow-float': 'slow-float 15s ease-in-out infinite',
        'slow-float-delay': 'slow-float 15s ease-in-out infinite 7.5s',
        'float-small': 'float-small 6s ease-in-out infinite',
        'float-particle': 'float-particle 15s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide': 'slide 20s linear infinite',
        'glow': 'glow 10s ease-in-out infinite',
        'float-1': 'float-1 8s ease-in-out infinite',
        'float-2': 'float-2 12s ease-in-out infinite',
        'float-3': 'float-3 10s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'float-icon': 'float-icon 3s ease-in-out infinite'
      },
      keyframes: {
        'slow-pulse': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.1)' }
        },
        'slow-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-2%, -2%) scale(1.05)' }
        },
        'float-small': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-particle': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -20px) rotate(90deg)' },
          '50%': { transform: 'translate(-15px, -35px) rotate(180deg)' },
          '75%': { transform: 'translate(-25px, -10px) rotate(270deg)' }
        },
        'ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0
          }
        },
        'slide': {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(50px) translateY(50px)' }
        },
        'glow': {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' }
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' }
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) translateX(0)' },
          '33%': { transform: 'translateY(-10px) rotate(3deg) translateX(5px)' },
          '66%': { transform: 'translateY(5px) rotate(-3deg) translateX(-5px)' }
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '25%': { transform: 'translateY(-7px) scale(1.05) rotate(2deg)' },
          '75%': { transform: 'translateY(7px) scale(0.95) rotate(-2deg)' }
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: 0.5 },
          '75%, 100%': { transform: 'scale(2)', opacity: 0 }
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        'float-icon': {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.1)' },
          '100%': { transform: 'translateY(0px) scale(1)' }
        }
      },
      container: {
        center: true,
        padding: '1rem'
      },
      backgroundImage: {
        'stripes-light':
          'repeating-linear-gradient(45deg, rgba(227, 6, 19, 0.03), rgba(227, 6, 19, 0.03) 12px, transparent 12px, transparent 24px)'
      }
    }
  }
} 