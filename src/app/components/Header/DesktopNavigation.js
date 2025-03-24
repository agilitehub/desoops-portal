import React from 'react'
import Navigation from './Navigation'

/**
 * Desktop navigation menu for medium and larger screen sizes
 * Implements DeSo color scheme
 */
const DesktopNavigation = () => {
  const navLinkClasses = ({ isActive }) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors 
    ${isActive 
      ? 'text-white bg-deso-accent' 
      : 'text-white hover:bg-deso-light hover:bg-opacity-20'}`

  return (
    <Navigation
      containerClassName="hidden md:flex space-x-6"
      navLinkClassName={navLinkClasses}
    />
  )
}

export default DesktopNavigation 