import React from 'react'
import ThemeSection from '../ThemeSection'
import SubSection from '../SubSection'
import CodeSnippet from '../CodeSnippet'
import UtilityClassRow from '../UtilityClassRow'

/**
 * Utility Classes section of the theming guide
 */
const UtilityClassesSection = () => {
  // Utility classes
  const utilityClasses = [
    { name: 'btn', description: 'Base button styles' },
    { name: 'btn-primary', description: 'Primary button (red)' },
    { name: 'btn-secondary', description: 'Secondary button (slate)' },
    { name: 'btn-outline', description: 'Outline button' },
    { name: 'btn-ghost', description: 'Ghost button (transparent)' },
    { name: 'container-padded', description: 'Container with responsive padding' },
    { name: 'transition-all-fast', description: 'Fast 200ms transition' },
    { name: 'transition-all-medium', description: 'Medium 300ms transition' },
    { name: 'transition-all-slow', description: 'Slow 500ms transition' },
  ]

  return (
    <ThemeSection
      title="Utility Classes"
      description="Agilit-e Core includes several utility classes built on top of Tailwind to speed up common development tasks."
    >
      <SubSection title="Available Utilities">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {utilityClasses.map((utilClass, index) => (
                <UtilityClassRow key={index} utilClass={utilClass} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>
      
      <SubSection title="Button Examples" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            <h4 className="text-lg font-medium mb-3">Usage</h4>
            <CodeSnippet code={`<button className="btn-primary">
  Primary Button
</button>

<button className="btn-secondary">
  Secondary Button
</button>

<button className="btn-outline">
  Outline Button
</button>

<button className="btn-ghost">
  Ghost Button
</button>`} />
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
            <h4 className="text-lg font-medium mb-3">Result</h4>
            <div className="flex flex-col space-y-3">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-outline">Outline Button</button>
              <button className="btn-ghost">Ghost Button</button>
            </div>
          </div>
        </div>
      </SubSection>
    </ThemeSection>
  )
}

export default UtilityClassesSection 