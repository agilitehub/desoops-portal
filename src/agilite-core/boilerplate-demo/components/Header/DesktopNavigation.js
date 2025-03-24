import React from 'react'
import Navigation from './Navigation'

/**
 * Desktop navigation menu for medium and larger screen sizes
 */
const DesktopNavigation = () => {
  const navLinkClasses = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors 
    ${isActive 
      ? 'text-white bg-agilite-red' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`

  return (
    <Navigation
      containerClassName="hidden md:flex space-x-4"
      navLinkClassName={navLinkClasses}
    />
  )
}

export default DesktopNavigation 