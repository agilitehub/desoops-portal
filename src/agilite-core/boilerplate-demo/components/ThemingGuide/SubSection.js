import React from 'react'

/**
 * Sub-section component with consistent styling for the theming guide
 */
const SubSection = ({ title, children, className = "" }) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export default SubSection 