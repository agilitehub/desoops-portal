import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo, ThemeToggle } from '@/agilite-core/index'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import MobileMenuButton from './MobileMenuButton'

/**
 * Header component for the boilerplate demo app
 * Composed of multiple smaller components for better separation of concerns
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 sticky top-0 z-50">
      <div className="container-padded">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="small" />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center">
            <ThemeToggle />
            <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  )
}

export default Header 