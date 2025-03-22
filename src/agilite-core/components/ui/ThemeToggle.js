import React from 'react'
import { useTheme } from '../../context/ThemeContext'

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 flex items-center shadow-md border ${
        darkMode ? 'bg-gray-800 justify-end border-agilite-red/50' : 'bg-agilite-red justify-start border-transparent'
      } ${className}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className='sr-only'>{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>

      {/* Switch Track Background */}
      <div className='absolute inset-0 rounded-full overflow-hidden'>
        {/* Night Background */}
        <div
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${darkMode ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-gray-900 to-agilite-black'>
            {/* Stars - only visible in dark mode */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-100' : 'opacity-0'}`}
            >
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className='absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_2px_1px_rgba(255,255,255,0.7)]'
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
        {/* Day Background */}
        <div
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${darkMode ? 'translate-x-full' : 'translate-x-0'}`}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-agilite-red/20 to-red-100'></div>
          {/* Clouds - only visible in light mode */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'opacity-0' : 'opacity-30'}`}>
            <div className='absolute top-1 left-2 w-4 h-2 bg-white rounded-full'></div>
            <div className='absolute top-3 right-3 w-3 h-1.5 bg-white rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Toggle Legends */}
      <div className='absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 text-[8px] font-bold'>
        <span className={`text-white transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
          ON
        </span>
        <span className={`text-white transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
          OFF
        </span>
      </div>

      {/* Toggle Handle */}
      <div
        className={`relative z-10 w-6 h-6 rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
          darkMode ? 'bg-agilite-red' : 'bg-white'
        }`}
      >
        {/* Sun Icon - Light Mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className='w-3 h-3 bg-agilite-red rounded-full'></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='absolute w-0.5 h-1.5 bg-agilite-red'
              style={{
                transformOrigin: 'center center',
                transform: `rotate(${i * 45}deg) translateY(-3px)`
              }}
            ></div>
          ))}
        </div>

        {/* Moon Icon - Dark Mode */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className='w-3.5 h-3.5 bg-white rounded-full'></div>
          <div className='absolute top-1 right-1.5 w-2 h-2 bg-agilite-red rounded-full'></div>
        </div>
      </div>
    </button>
  )
}

export default ThemeToggle 