import React from 'react'

/**
 * Reusable section title component for consistent section headings
 */
const SectionTitle = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-center mb-4 text-gray-900 dark:text-white">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionTitle 