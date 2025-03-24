import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { CodeBlock } from '../shared'

/**
 * Component Section - Renders a component showcase section with examples and documentation
 */
const ComponentSection = ({ title, description, usage, example, codeExample, props = [], notes }) => {
  const [showCode, setShowCode] = useState(false)
  
  return (
    <section id={title.toLowerCase()} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      
      {/* Import usage */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-mono text-sm text-gray-800 dark:text-gray-200">
        {usage}
      </div>
      
      {/* Example */}
      {example && (
        <div className="border-b border-gray-200 dark:border-gray-700 relative">
          {example}
        </div>
      )}
      
      {/* Code Example */}
      {codeExample && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold">Code Example</h3>
            <button 
              onClick={() => setShowCode(!showCode)}
              className="text-sm inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-agilite-red dark:hover:text-agilite-red"
            >
              <FontAwesomeIcon icon={faCode} className="mr-2" />
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          
          {showCode && <CodeBlock code={codeExample.trim()} />}
        </div>
      )}
      
      {/* Props Table */}
      {props.length > 0 && <PropsTable props={props} />}
      
      {/* Notes */}
      {notes && (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/20">
          <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Notes</h3>
          <p className="text-yellow-700 dark:text-yellow-300">{notes}</p>
        </div>
      )}
    </section>
  )
}

/**
 * Props Table - Displays component props in a table format
 */
const PropsTable = ({ props }) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4">Props</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Default</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {props.map((prop, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                <td className="px-4 py-4 text-sm font-medium text-agilite-red">{prop.name}</td>
                <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-gray-300">{prop.type}</td>
                <td className="px-4 py-4 text-sm font-mono text-gray-900 dark:text-gray-300">{prop.default}</td>
                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComponentSection 