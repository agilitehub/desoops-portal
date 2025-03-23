import React, { useState } from 'react'
import { Logo, ThemeToggle, BackgroundEffect } from '../../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'

/**
 * Component showcase page that demonstrates all available components
 * with examples and code snippets
 */
const ComponentsShowcase = () => {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h1 className="mb-6">Core Components</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore the available components in the Agilit-e Core library. Each component can be easily imported 
          and incorporated into your React application.
        </p>
      </div>
      
      {/* Logo Component */}
      <ComponentSection
        title="Logo"
        description="The Logo component displays the Agilit-e brand logo. It supports different sizes, variants, and can be displayed with or without text."
        usage="import { Logo } from './agilite-core';"
        example={
          <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8">
            <Logo size="small" />
            <Logo size="medium" />
            <Logo size="large" />
            <Logo size="medium" showText={false} />
            <Logo size="medium" variant="grayscale" />
          </div>
        }
        codeExample={`
<Logo size="small" />
<Logo size="medium" /> {/* Default */}
<Logo size="large" />
<Logo showText={false} />
<Logo variant="grayscale" />
`}
        props={[
          { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Controls the size of the logo' },
          { name: 'showText', type: 'boolean', default: 'true', description: 'Whether to show the text next to the logo' },
          { name: 'variant', type: "'color' | 'grayscale'", default: "'color'", description: 'The color variant of the logo' },
          { name: 'textColor', type: 'string', default: "'text-agilite-slate'", description: 'TailwindCSS class for the text color' },
          { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply' }
        ]}
      />
      
      {/* ThemeToggle Component */}
      <ComponentSection
        title="ThemeToggle"
        description="The ThemeToggle component provides a toggle switch for users to switch between light and dark modes. It works in conjunction with the ThemeProvider context."
        usage="import { ThemeToggle, ThemeProvider } from './agilite-core';"
        example={
          <div className="p-8 flex items-center justify-center">
            <ThemeToggle />
          </div>
        }
        codeExample={`
// In your main App component:
<ThemeProvider>
  <App />
</ThemeProvider>

// In your header/navbar:
<ThemeToggle />
`}
        props={[
          { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply' }
        ]}
        notes="The ThemeToggle component must be used within a ThemeProvider context. It automatically stores the user's preference in localStorage and respects the user's system preference."
      />
      
      {/* BackgroundEffect Component */}
      <ComponentSection
        title="BackgroundEffect"
        description="The BackgroundEffect component adds a decorative background with subtle animations and gradients. It automatically adjusts for light and dark modes."
        usage="import { BackgroundEffect } from './agilite-core';"
        example={
          <div className="relative h-64 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <BackgroundEffect />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
                <p className="text-center font-medium">Content appears on top of the background</p>
              </div>
            </div>
          </div>
        }
        codeExample={`
<div className="relative">
  <BackgroundEffect />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
`}
        props={[
          { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply (e.g., "opacity-50" for a more subtle effect)' }
        ]}
        notes="The BackgroundEffect component should be used within a relative positioned container with your content having a higher z-index."
      />
      
      {/* ThemeProvider Context */}
      <ComponentSection
        title="ThemeProvider (Context)"
        description="The ThemeProvider provides a context for managing light and dark mode themes across your application. It includes automatic detection of system preferences and persists the user's choice in localStorage."
        usage="import { ThemeProvider, useTheme } from './agilite-core';"
        codeExample={`
// Wrap your app with the provider
<ThemeProvider>
  <App />
</ThemeProvider>

// Use the theme context in any component
const MyComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div>
      <p>Current theme: {darkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleDarkMode}>
        Toggle Theme
      </button>
    </div>
  );
};
`}
        props={[]}
        notes="The ThemeProvider handles all the logic for theme switching including applying the 'dark' class to the html element and storing preferences."
      />
      
      {/* CSS Utilities */}
      <ComponentSection
        title="CSS Utilities"
        description="The Agilit-e Core library includes a set of utility classes built on top of TailwindCSS for common styling needs."
        usage="/* These are automatically imported with the core CSS */"
        codeExample={`
<!-- Buttons -->
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-outline">Outline Button</button>
<button className="btn-ghost">Ghost Button</button>

<!-- Container -->
<div className="container-padded">
  Padded container with responsive sizing
</div>

<!-- Transitions -->
<div className="transition-all-fast">Fast transition</div>
<div className="transition-all-medium">Medium transition</div>
<div className="transition-all-slow">Slow transition</div>
`}
        example={
          <div className="p-8 flex flex-wrap items-center justify-center gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-outline">Outline Button</button>
            <button className="btn-ghost">Ghost Button</button>
          </div>
        }
        notes="These utility classes are part of the core CSS and follow the TailwindCSS semantic naming convention."
      />
      
      {/* Tailwind Config */}
      <ComponentSection
        title="Tailwind Configuration"
        description="The Agilit-e Core library includes a custom Tailwind configuration with predefined colors, animations, and utilities."
        usage="// In your tailwind.config.js file"
        codeExample={`
const agiliteCore = require('./src/agilite-core/config/tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: agiliteCore.theme,
  plugins: []
}
`}
        notes="The core Tailwind configuration includes Agilit-e brand colors, custom animations, and other useful theme extensions."
      />
    </div>
  )
}

/**
 * Component Section - Renders a component showcase section
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
      <div className="p-4 bg-gray-100 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 font-mono text-sm">
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
          
          {showCode && (
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 overflow-x-auto">
              <code className="text-sm">{codeExample.trim()}</code>
            </pre>
          )}
        </div>
      )}
      
      {/* Props Table */}
      {props.length > 0 && (
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
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'}>
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
      )}
      
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

export default ComponentsShowcase 