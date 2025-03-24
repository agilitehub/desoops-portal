import React from 'react'
import PropTypes from 'prop-types'

/**
 * PageLayout component that provides consistent background styling for all pages
 * Uses DeSo color scheme and gradient patterns
 */
const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative text-gray-900 dark:text-gray-50">
      {/* Background Base */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-deso-light/10 to-deso-accent/10
        dark:from-deso-secondary/95 dark:to-deso-dark/90
        transition-colors duration-300" />

      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Top-right feature */}
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] 
          bg-gradient-to-b from-deso-azure/50 to-transparent
          dark:from-deso-accent/60 dark:to-transparent
          rounded-[100px] transform rotate-45 animate-float-1 transition-colors duration-300" />
        
        {/* Bottom-left feature */}
        <div className="absolute -bottom-40 -left-40 w-[800px] h-[800px] 
          bg-gradient-to-tr from-deso-accent/50 to-transparent
          dark:from-deso-light/50 dark:to-transparent
          rounded-[150px] transform -rotate-12 animate-float-2 transition-colors duration-300" />

        {/* Center accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[200px] 
          bg-gradient-to-r from-transparent via-deso-azure/40 to-transparent
          dark:from-transparent dark:via-deso-accent/50 dark:to-transparent
          rounded-[80px] transform rotate-6 animate-float-3 transition-colors duration-300" />

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 
          bg-deso-light/40 dark:bg-deso-light/40
          rounded-[60px] transform rotate-12 animate-float-2 transition-colors duration-300" />

        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 
          bg-deso-accent/45 dark:bg-deso-accent/45
          rounded-[70px] transform -rotate-12 animate-float-1 transition-colors duration-300" />

        {/* Additional geometric accents */}
        <div className="absolute top-1/2 right-1/3 w-64 h-64
          bg-deso-azure/45 dark:bg-deso-light/45
          rounded-[40px] transform rotate-45 animate-float-3 transition-colors duration-300" />

        <div className="absolute bottom-1/4 right-1/4 w-72 h-72
          bg-deso-accent/40 dark:bg-deso-accent/40
          rounded-[50px] transform -rotate-12 animate-float-2 transition-colors duration-300" />

        {/* Subtle directional gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deso-light/10 to-deso-accent/10 
          dark:from-transparent dark:via-deso-light/10 dark:to-deso-dark/20" />

        {/* Footer gradient - more subtle */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-deso-dark/20 to-transparent 
          opacity-100 dark:opacity-25 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="relative z-10 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 dark:[&_h1]:text-white
        [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-800 dark:[&_h2]:text-gray-50
        [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-gray-800 dark:[&_h3]:text-gray-100
        [&_p]:text-base [&_p]:text-gray-700 dark:[&_p]:text-gray-200
        [&_a]:text-deso-blue dark:[&_a]:text-deso-light hover:[&_a]:text-deso-accent dark:hover:[&_a]:text-deso-accent
        [&_strong]:font-semibold [&_strong]:text-gray-900 dark:[&_strong]:text-white
        [&_button]:font-medium
        [&_label]:text-gray-700 dark:[&_label]:text-gray-200">
        {children}
      </div>
    </div>
  )
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired
}

export default PageLayout