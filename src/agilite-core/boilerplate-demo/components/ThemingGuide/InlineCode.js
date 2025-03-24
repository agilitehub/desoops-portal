import React from 'react'

/**
 * Inline code component for displaying code within text
 */
const InlineCode = ({ children }) => {
  return (
    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">{children}</code>
  )
}

export default InlineCode 