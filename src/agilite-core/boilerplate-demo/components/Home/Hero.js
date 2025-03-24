import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faPalette } from '@fortawesome/free-solid-svg-icons'

/**
 * Hero section for the home page
 */
const Hero = () => {
  return (
    <div className="py-16 text-center">
      <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
        Welcome to <span className="text-agilite-red">Agilit-e Core</span>
      </h1>
      <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
        A collection of reusable components, utilities, and theming for React applications. 
        Built with TailwindCSS and designed for maximum flexibility.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
        <Link 
          to="/components" 
          className="btn-primary inline-flex items-center text-base"
        >
          <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
          View Components
        </Link>
        <Link 
          to="/theming" 
          className="btn-outline inline-flex items-center text-base"
        >
          <FontAwesomeIcon icon={faPalette} className="mr-2" />
          Theming Guide
        </Link>
      </div>
    </div>
  )
}

export default Hero 