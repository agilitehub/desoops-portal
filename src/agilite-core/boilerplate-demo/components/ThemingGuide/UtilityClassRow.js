import React from 'react'

/**
 * Utility class row component for displaying utility class information
 */
const UtilityClassRow = ({ utilClass, index }) => {
  return (
    <tr className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'}>
      <td className="px-4 py-4 text-sm font-mono text-agilite-red">{utilClass.name}</td>
      <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{utilClass.description}</td>
    </tr>
  )
}

export default UtilityClassRow 