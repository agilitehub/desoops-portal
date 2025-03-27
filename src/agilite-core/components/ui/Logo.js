import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'

/**
 * Logo component that automatically switches between light and dark mode versions
 * 
 * @component
 * @example
 * // Basic usage
 * <Logo />
 * 
 * // With custom size and additional classes
 * <Logo className="w-16 h-16 my-4" />
 * 
 * // With custom alt text
 * <Logo alt="DeSoOps Logo" />
 */
const Logo = memo(({ className = '', alt = 'DeSoOps Logo' }) => {
  const { darkMode } = useTheme()
  
  return (
    <img
      src={darkMode ? '/logo-dark.png' : '/logo-default.png'}
      alt={alt}
      className={`h-10 w-auto object-contain transition-all duration-300 ${className}`}
    />
  )
})

Logo.propTypes = {
  /** Additional CSS classes to apply to the logo */
  className: PropTypes.string,
  /** Alternative text for the logo image */
  alt: PropTypes.string
}

Logo.defaultProps = {
  className: '',
  alt: 'DeSoOps Logo'
}

// Display name for React DevTools
Logo.displayName = 'Logo'

export default Logo 