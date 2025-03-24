import React from 'react'

/**
 * Reusable code block component for displaying code examples
 */
const CodeBlock = ({ code }) => {
  return (
    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mt-2 overflow-x-auto">
      <code className="text-sm text-gray-800 dark:text-gray-200">
        {code}
      </code>
    </pre>
  )
}

export default CodeBlock 