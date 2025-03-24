import React from 'react'

/**
 * Color swatch component for the color system section
 */
const ColorSwatch = ({ color }) => {
  return (
    <div className="rounded-md overflow-hidden shadow">
      <div 
        className={`h-24 flex items-end p-3 ${color.textColor}`}
        style={{ backgroundColor: color.value }}
      >
        <div>
          <div className="font-semibold">{color.name}</div>
          <div className="text-sm opacity-90">{color.value}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 p-3 text-sm border-t dark:border-gray-700 text-gray-800 dark:text-gray-200">
        <code className="font-mono">
          bg-{color.name}
        </code>
      </div>
    </div>
  )
}

export default ColorSwatch 