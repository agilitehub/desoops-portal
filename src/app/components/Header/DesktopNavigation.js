import React from 'react'
import Navigation from './Navigation'
import { NavLink } from 'react-router-dom'

/**
 * Desktop navigation menu for medium and larger screen sizes
 * Implements DeSo color scheme
 */
const DesktopNavigation = () => {
  const navLinkClasses = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm whitespace-nowrap font-semibold tracking-wide transition-colors 
    ${isActive 
      ? 'text-white bg-deso-accent' 
      : 'text-white hover:bg-deso-light hover:bg-opacity-20'}`

  return (
    <Navigation
      containerClassName="hidden md:flex items-center space-x-4 lg:space-x-6"
      navLinkClassName={navLinkClasses}
    >
      <NavLink to="/changelog" className={navLinkClasses}>
        Changelog
      </NavLink>
      <NavLink to="/roadmap" className={navLinkClasses}>
        Roadmap
      </NavLink>
    </Navigation>
  )
}

export default DesktopNavigation 