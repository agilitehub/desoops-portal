import React from 'react'

/**
 * Copyright section for the footer
 */
const Copyright = ({ companyName = 'Agilit-e Core' }) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {currentYear} {companyName}. All rights reserved.
      </p>
    </div>
  )
}

export default Copyright 