import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/agilite-core/components/ui/ThemeToggle'
import Logo from '@/agilite-core/components/ui/Logo'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import MobileMenuButton from './MobileMenuButton'
import styles from '@/custom/modules/Login/style.module.sass'

/**
 * Header component for DeSo Ops
 * Uses the DeSo color scheme and maintains responsive design
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-gradient-to-r from-deso-primary/90 to-deso-accent/85 dark:from-deso-secondary/60 dark:to-deso-accent/60 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container-padded">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 w-[200px]">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo className="h-14 w-14 transition-transform duration-300 group-hover:scale-105" alt="DeSoOps Logo" />
              <span className={styles.brandText}>DeSoOps</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-grow flex justify-center max-w-xl">
            <div className="w-full flex justify-center">
              <DesktopNavigation />
            </div>
          </div>

          {/* Theme Toggle, Auth Links, and Mobile Menu Button */}
          <div className="flex items-center w-[400px] justify-end">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link 
                  to="/signin" 
                  className="bg-deso-light/15 text-white hover:bg-deso-light/25 transition-all duration-200 
                    px-4 py-2 rounded-md text-sm font-medium border border-deso-light/25 whitespace-nowrap"
                >
                  Sign In with DeSo
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-deso-accent/95 text-white px-4 py-2 rounded-md text-sm font-medium 
                    hover:bg-deso-accent/85 transition-colors whitespace-nowrap"
                >
                  Create DeSo Account
                </Link>
              </div>
              <div className="pl-4 border-l border-deso-light/20">
                <div className={styles.themeToggleWrapper}>
                  <ThemeToggle />
                </div>
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