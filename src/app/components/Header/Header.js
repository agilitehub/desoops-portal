import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/agilite-core/components/ui/ThemeToggle'
import Logo from '@/agilite-core/components/ui/Logo'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import MobileMenuButton from './MobileMenuButton'
import styles from '@/custom/modules/Login/style.module.sass'

/**
 * Header component for DeSoOps
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
              <Logo 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-lg dark:drop-shadow-[0_2px_4px_rgba(255,127,80,0.2)]" 
                alt="DeSoOps Logo" 
              />
              <span className={`${styles.brandText} dark:text-white/90`}>DeSoOps</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-grow flex justify-center max-w-xl">
            <div className="w-full flex justify-center">
              <DesktopNavigation />
            </div>
          </div>

          {/* Theme Toggle, Auth Links, and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/signin" 
                  className="text-white hover:text-deso-light transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-deso-accent via-deso-accent/95 to-deso-accent/90 text-white 
                    hover:from-deso-accent hover:via-deso-accent hover:to-deso-accent/95
                    transition-all duration-300 transform hover:scale-105
                    px-5 py-2.5 rounded-lg text-sm font-semibold
                    shadow-[0_4px_12px_rgba(255,127,80,0.25)] hover:shadow-[0_6px_16px_rgba(255,127,80,0.35)]
                    whitespace-nowrap relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                    translate-x-[-100%] animate-shimmer group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative">Create DeSo Account</span>
                </Link>
              </div>
              <div className="pl-4 border-l border-deso-light/20">
                <div className={styles.themeToggleWrapper}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
            {/* Mobile Theme Toggle and Menu Button */}
            <div className="md:hidden flex items-center">
              <div className="mr-2">
                <ThemeToggle />
              </div>
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