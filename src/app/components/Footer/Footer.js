import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Logo } from '@/agilite-core/index'

/**
 * Footer component for the boilerplate demo app
 * Composed of multiple smaller components for better separation of concerns
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-deso-primary to-deso-primary/95 dark:from-deso-secondary dark:to-deso-secondary/95">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-5">
            <Logo size="large" className="h-12 w-auto hover:opacity-90 transition-opacity duration-200 drop-shadow-lg" />
            <p className="text-white/90 text-lg mt-8 max-w-md font-medium leading-relaxed drop-shadow-sm">
              DeSoOps - Your comprehensive platform for managing decentralized social operations, 
              token distributions, and crypto asset management.
            </p>
          </div>

          {/* Navigation Sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-deso-accent drop-shadow-sm">
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  <li>
                    <a 
                      href="https://focus.xyz" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group inline-flex items-center text-white/90 hover:text-deso-accent transition-colors text-base"
                    >
                      <span className="font-semibold drop-shadow-sm">Focus Platform</span>
                      <FontAwesomeIcon 
                        icon={faArrowUpRightFromSquare} 
                        className="ml-2 text-xs opacity-70 group-hover:opacity-100 transition-opacity" 
                      />
                    </a>
                  </li>
                  <li>
                    <Link to="/coin-swap" className="text-white/90 hover:text-deso-accent transition-colors text-base font-semibold drop-shadow-sm">
                      Coin Swap
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-white/90 hover:text-deso-accent transition-colors text-base font-semibold drop-shadow-sm">
                      Help Center
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-deso-accent drop-shadow-sm">
                  Support
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link to="/terms" className="text-white/90 hover:text-deso-accent transition-colors text-base font-semibold drop-shadow-sm">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="text-white/90 hover:text-deso-accent transition-colors text-base font-semibold drop-shadow-sm">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/80 text-base font-medium drop-shadow-sm">
              © {new Date().getFullYear()} DeSoOps. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 