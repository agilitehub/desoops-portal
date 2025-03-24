import React from 'react'
import FooterLogo from './FooterLogo'
import FooterLinks from './FooterLinks'
import Copyright from './Copyright'
import { getFooterResourceItems, getFooterConnectItems } from '../../config/navigation'

/**
 * Footer component for the boilerplate demo app
 * Composed of multiple smaller components for better separation of concerns
 */
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-padded py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Description */}
          <FooterLogo description="A reusable component library for Agilit-e projects" />
          
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0">
            <FooterLinks title="Resources" items={getFooterResourceItems()} />
            <FooterLinks title="Connect" items={getFooterConnectItems()} />
          </div>
        </div>
        
        {/* Copyright */}
        <Copyright />
      </div>
    </footer>
  )
}

export default Footer 