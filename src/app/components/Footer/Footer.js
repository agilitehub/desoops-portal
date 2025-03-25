import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { Logo } from '@/agilite-core/index'

/**
 * Footer component for the boilerplate demo app
 * Composed of multiple smaller components for better separation of concerns
 */
const Footer = () => {
  return (
    <footer className="bg-deso-primary dark:bg-deso-secondary text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Logo size="large" className="mb-6 hover:opacity-90 transition-opacity duration-200 drop-shadow-lg" />
            <p className="text-white text-lg mt-6 max-w-md font-semibold leading-relaxed drop-shadow-sm">
              DeSo Ops - Your comprehensive platform for managing decentralized social operations, 
              token distributions, and crypto asset management.
            </p>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-deso-accent drop-shadow-sm">DeSo Platforms</h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://focus.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center text-white hover:text-deso-accent transition-colors text-lg"
                >
                  <span className="font-bold drop-shadow-sm">Focus Platform</span>
                  <FontAwesomeIcon 
                    icon={faArrowUpRightFromSquare} 
                    className="ml-2 text-sm opacity-70 group-hover:opacity-100 transition-opacity" 
                  />
                </a>
                <p className="text-white text-base mt-1 opacity-90 drop-shadow-sm">The premier DeSo social platform</p>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-deso-accent drop-shadow-sm">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/coin-swap" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  Coin Swap
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-deso-accent drop-shadow-sm">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/docs" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white hover:text-deso-accent transition-colors text-lg font-semibold drop-shadow-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <a href="https://twitter.com/desoops" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-deso-accent transition-colors drop-shadow-sm">
                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
              </a>
              <a href="https://discord.gg/desoops" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-deso-accent transition-colors drop-shadow-sm">
                <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
              </a>
              <a href="https://github.com/desoops" target="_blank" rel="noopener noreferrer"
                className="text-white hover:text-deso-accent transition-colors drop-shadow-sm">
                <FontAwesomeIcon icon={faGithub} className="text-2xl" />
              </a>
            </div>
            <p className="text-white text-lg font-semibold drop-shadow-sm">
              © {new Date().getFullYear()} DeSo Ops. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 