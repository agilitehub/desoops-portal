import React from 'react'

/**
 * Code snippet component with default styling for the theming guide
 */
const CodeSnippet = ({ code }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
      <pre className="text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default CodeSnippet 