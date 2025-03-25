import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/agilite-core/components/ui/ThemeToggle'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import MobileMenuButton from './MobileMenuButton'

/**
 * Header component for DeSo Ops
 * Uses the DeSo color scheme and maintains responsive design
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-deso-primary dark:bg-deso-secondary shadow-lg sticky top-0 z-50">
      <div className="container-padded">
        <div className="flex justify-between h-16 items-center -ml-4">
          {/* Logo */}
          <div className="flex-shrink-0 pr-8 flex items-center gap-3 pl-4">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo-default.png" alt="DeSo Logo" className="h-8 w-8" />
              <span className="text-xl font-semibold text-white">DeSoOps</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-grow flex justify-center">
            <div className="px-8">
              <DesktopNavigation />
            </div>
          </div>

          {/* Theme Toggle, Auth Links, and Mobile Menu Button */}
          <div className="flex items-center pl-8">
            <div className="hidden md:flex items-center space-x-4 border-l border-deso-light/20 pl-8">
              <Link 
                to="/signin" 
                className="bg-deso-light/20 text-white hover:bg-deso-light/30 transition-all duration-200 
                  px-4 py-2 rounded-md text-sm font-medium border border-deso-light/30"
              >
                Sign In with DeSo
              </Link>
              <Link 
                to="/signup" 
                className="bg-deso-accent text-white px-4 py-2 rounded-md text-sm font-medium 
                  hover:bg-deso-accent/90 transition-colors"
              >
                Create DeSo Account
              </Link>
              <div className="pl-4 border-l border-deso-light/20">
                <ThemeToggle />
              </div>
            </div>
            <div className="md:hidden pl-4">
              <MobileMenuButton isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </header>
  )
}

export default Header 