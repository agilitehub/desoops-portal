import React from 'react'
import { Logo } from '../../index'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

/**
 * Footer component for the boilerplate demo app
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-padded py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Logo size="small" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              A reusable component library for Agilit-e projects
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/components" className="text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red">
                    Components
                  </Link>
                </li>
                <li>
                  <Link to="/theming" className="text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red">
                    Theming Guide
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Connect</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a 
                    href="https://github.com/agilite"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red"
                  >
                    <FontAwesomeIcon icon={faGithub} className="mr-2" />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Agilit-e Core. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 