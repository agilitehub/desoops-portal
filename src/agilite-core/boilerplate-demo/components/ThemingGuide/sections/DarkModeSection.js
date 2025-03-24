import React from 'react'
import ThemeSection from '../ThemeSection'
import SubSection from '../SubSection'
import CodeSnippet from '../CodeSnippet'
import InlineCode from '../InlineCode'

/**
 * Dark Mode section of the theming guide
 */
const DarkModeSection = () => {
  return (
    <ThemeSection
      title="Dark Mode"
      description="The Agilit-e Core library includes a complete dark mode implementation that automatically detects user preferences and persists their choice."
    >
      <SubSection title="How It Works">
        <p>
          The dark mode implementation works by adding a <InlineCode>dark</InlineCode> class to the <InlineCode>html</InlineCode> element. 
          This enables all the Tailwind dark mode variants (<InlineCode>dark:bg-gray-900</InlineCode>, etc.).
        </p>
        
        <CodeSnippet code={`// Example component with dark mode support
const Card = () => (
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-md shadow">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-gray-600 dark:text-gray-300">
      This card automatically adapts to dark mode.
    </p>
  </div>
);`} />
        
        <p>
          The system also stores the user's preference in <InlineCode>localStorage</InlineCode> and 
          will detect system preferences using <InlineCode>prefers-color-scheme</InlineCode> media query.
        </p>
      </SubSection>
      
      <SubSection title="Implementation" className="mt-8">
        <p>
          To implement dark mode in your application, add the <InlineCode>ThemeProvider</InlineCode> to your app's root component:
        </p>
        
        <CodeSnippet code={`import { ThemeProvider } from './agilite-core';

const App = () => (
  <ThemeProvider>
    {/* Your app components */}
  </ThemeProvider>
);`} />
        
        <p>
          Then add the <InlineCode>ThemeToggle</InlineCode> component in your navbar or settings to give users control:
        </p>
        
        <CodeSnippet code={`import { ThemeToggle } from './agilite-core';

const Navbar = () => (
  <nav>
    {/* Other navbar items */}
    <ThemeToggle />
  </nav>
);`} />
      </SubSection>
    </ThemeSection>
  )
}

export default DarkModeSection 