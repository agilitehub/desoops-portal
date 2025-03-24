import React from 'react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Logo component that displays the Agilit-e brand logo
 * Uses different logo files for light and dark modes
 */
const Logo = ({
  className = '',
  textColor = 'text-agilite-slate',
  showText = true,
  variant = 'color', // 'color' or 'grayscale'
  size = 'medium' // 'small', 'medium', 'large'
}) => {
  const { darkMode } = useTheme()

  // Size mapping
  const sizeMap = {
    small: 'h-10',
    medium: 'h-16',
    large: 'h-24'
  }

  const logoSize = sizeMap[size] || sizeMap.medium
  
  // Apply grayscale filter if variant is grayscale
  const logoFilter = variant === 'grayscale' ? 'filter grayscale' : ''
  
  // Use different logos for light and dark modes
  const logoSrc = darkMode ? '/logo-dark.png' : '/logo-default.png'

  return (
    <div className={`flex items-center ${className}`}>
      {/* PNG Logo */}
      <div className={`relative ${logoSize} mr-4`}>
        <img 
          src={logoSrc}
          alt="Agilit-e Logo" 
          className={`${logoSize} w-auto object-contain ${logoFilter}`}
        />
      </div>

      {/* Agilit-e text */}
      {showText && (
        <span
          className={`text-3xl font-normal tracking-wider ${darkMode ? 'text-white' : textColor}`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          AGILIT-E
        </span>
      )}
    </div>
  )
}

export default Logo 