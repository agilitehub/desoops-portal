import React from 'react'
import PropTypes from 'prop-types'
import Navigation from './Navigation'

/**
 * Mobile navigation menu that slides down when the menu button is clicked
 * Implements DeSo color scheme
 */
const MobileNavigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const navLinkClasses = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-lg font-bold tracking-wide transition-colors
    ${isActive
      ? 'text-white bg-deso-accent'
      : 'text-white hover:bg-deso-light hover:bg-opacity-20'}`

  return (
    <div
      className={`md:hidden transition-all duration-200 ease-in-out overflow-hidden
      ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}
    >
      <div className="px-2 pt-2 pb-3">
        <Navigation
          containerClassName="space-y-1"
          navLinkClassName={navLinkClasses}
          onLinkClick={() => setIsMenuOpen(false)}
        />
      </div>
    </div>
  )
}

MobileNavigation.propTypes = {
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired
}

export default MobileNavigation 