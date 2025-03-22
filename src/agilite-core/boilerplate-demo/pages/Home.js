import React from 'react'
import { BackgroundEffect } from '../../index'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faPalette } from '@fortawesome/free-solid-svg-icons'

/**
 * Home page component for the boilerplate demo
 * Serves as an introduction and navigation hub
 */
const Home = () => {
  return (
    <div className="relative">
      {/* Background effects using core component */}
      <BackgroundEffect className="opacity-50" />
      
      <div className="relative z-10">
        {/* Hero section */}
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
        
        {/* Features section */}
        <div className="py-16">
          <h2 className="text-center mb-12 text-gray-900 dark:text-white">Core Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-agilite-red/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-agilite-red text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Reusable Components</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pre-built UI components like logos, theme toggles, and background effects 
                that can be easily imported and used in any React application.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-agilite-red/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-agilite-red text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Dark Mode Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built-in theme context provides easy dark/light mode switching with 
                localStorage persistence and system preference detection.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-agilite-red/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-agilite-red text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Tailwind Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Custom Tailwind configuration with brand colors, animations, and 
                reusable utility classes for consistent styling across projects.
              </p>
            </div>
          </div>
        </div>
        
        {/* Getting started section */}
        <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-center mb-8 text-gray-900 dark:text-white">Getting Started</h2>
          
          <div className="max-w-3xl mx-auto">
            <ol className="space-y-6 list-decimal list-inside ml-4">
              <li className="text-lg text-gray-800 dark:text-white">
                <span className="font-semibold">Import components</span>
                <p className="mt-2 text-gray-600 dark:text-gray-400 pl-6">
                  Import any component or utility directly from the core library:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mt-2 overflow-x-auto">
                  <code className="text-sm">
                    import {'{'} Logo, ThemeToggle, BackgroundEffect, ThemeProvider {'}'} from './agilite-core';
                  </code>
                </pre>
              </li>
              
              <li className="text-lg text-gray-800 dark:text-white">
                <span className="font-semibold">Set up ThemeProvider</span>
                <p className="mt-2 text-gray-600 dark:text-gray-400 pl-6">
                  Wrap your application with the ThemeProvider for dark mode support:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mt-2 overflow-x-auto">
                  <code className="text-sm">
                    {`<ThemeProvider>
  <YourApp />
</ThemeProvider>`}
                  </code>
                </pre>
              </li>
              
              <li className="text-lg text-gray-800 dark:text-white">
                <span className="font-semibold">Add the theme toggle</span>
                <p className="mt-2 text-gray-600 dark:text-gray-400 pl-6">
                  Add the theme toggle component to let users switch between light and dark mode:
                </p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mt-2 overflow-x-auto">
                  <code className="text-sm">
                    {`<header>
  <nav>
    <ThemeToggle />
  </nav>
</header>`}
                  </code>
                </pre>
              </li>
            </ol>
            
            <div className="mt-10 text-center">
              <Link to="/components" className="btn-primary">
                Explore Components
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 