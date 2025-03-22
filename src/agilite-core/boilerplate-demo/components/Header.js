import React, { useState } from 'react'
import { Logo, ThemeToggle } from '../../index'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

/**
 * Header component for the boilerplate demo app
 * Demonstrates how to use Logo and ThemeToggle components
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navLinkClasses = ({ isActive }) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors 
    ${isActive 
      ? 'text-white bg-agilite-red' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 sticky top-0 z-50">
      <div className="container-padded">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="small" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <NavLink to="/" className={navLinkClasses} end>
              Home
            </NavLink>
            <NavLink to="/components" className={navLinkClasses}>
              Components
            </NavLink>
            <NavLink to="/theming" className={navLinkClasses}>
              Theming
            </NavLink>
          </nav>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden ml-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <NavLink 
              to="/" 
              className={navLinkClasses} 
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/components" 
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Components
            </NavLink>
            <NavLink 
              to="/theming" 
              className={navLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Theming
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 