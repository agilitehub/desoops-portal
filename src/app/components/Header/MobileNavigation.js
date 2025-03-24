import React from 'react'
import Navigation from './Navigation'

/**
 * Mobile navigation menu for small screen sizes
 */
const MobileNavigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const navLinkClasses = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors 
    ${isActive 
      ? 'text-white bg-agilite-red' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`

  return (
    <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
      <Navigation
        containerClassName="pt-2 pb-3 space-y-1"
        navLinkClassName={navLinkClasses}
        onLinkClick={() => setIsMenuOpen(false)}
      />
    </div>
  )
}

export default MobileNavigation 