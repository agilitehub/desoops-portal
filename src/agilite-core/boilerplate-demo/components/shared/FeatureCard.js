import React from 'react'

/**
 * Reusable feature card component for highlighting features across the application
 */
const FeatureCard = ({ number, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
      <div className="h-12 w-12 bg-agilite-red/10 rounded-lg flex items-center justify-center mb-4">
        <span className="text-agilite-red text-2xl font-bold">{number}</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard 