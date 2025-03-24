import React from 'react'

/**
 * Reusable section component for the theming guide with consistent styling
 */
const ThemeSection = ({ title, description, children }) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </section>
  )
}

export default ThemeSection 