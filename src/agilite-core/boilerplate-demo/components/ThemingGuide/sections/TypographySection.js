import React from 'react'
import ThemeSection from '../ThemeSection'
import SubSection from '../SubSection'
import CodeSnippet from '../CodeSnippet'

/**
 * Typography section of the theming guide
 */
const TypographySection = () => {
  return (
    <ThemeSection
      title="Typography"
      description="Agilit-e Core defines consistent typography rules that automatically adjust for light and dark mode."
    >
      <div className="space-y-6">
        <div>
          <h1 className="mb-2">Heading 1</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">text-4xl font-bold md:text-5xl</p>
        </div>
        
        <div>
          <h2 className="mb-2">Heading 2</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">text-3xl font-bold md:text-4xl</p>
        </div>
        
        <div>
          <h3 className="mb-2">Heading 3</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">text-2xl font-bold md:text-3xl</p>
        </div>
        
        <div>
          <p className="mb-2">Default paragraph text</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">text-base text-gray-900 dark:text-white</p>
        </div>
        
        <div>
          <p className="text-sm mb-2">Small text</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">text-sm</p>
        </div>
      </div>
      
      <SubSection title="Font Family" className="mt-8">
        <p className="mb-4">
          The default font family is set to Inter with system fallbacks. You can customize this in the Tailwind configuration.
        </p>
        
        <CodeSnippet code={`fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['Inter', 'system-ui', 'sans-serif']
}`} />
      </SubSection>
    </ThemeSection>
  )
}

export default TypographySection 