import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

/**
 * Mobile menu toggle button for small screen sizes
 */
const MobileMenuButton = ({ isMenuOpen, toggleMenu }) => {
  return (
    <button
      type="button"
      className="md:hidden ml-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
      onClick={toggleMenu}
      aria-expanded={isMenuOpen}
    >
      <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
      <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
    </button>
  )
}

export default MobileMenuButton 