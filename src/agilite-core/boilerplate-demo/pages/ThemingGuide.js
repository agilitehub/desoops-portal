import React from 'react'
import { useTheme } from '../../index'

/**
 * Theming Guide page that explains how to use and customize theming
 */
const ThemingGuide = () => {
  const { darkMode } = useTheme()
  
  // Sample color palette
  const brandColors = [
    { name: 'agilite-red', value: '#E30613', textColor: 'text-white' },
    { name: 'agilite-black', value: '#151515', textColor: 'text-white' },
    { name: 'agilite-slate', value: '#1E293B', textColor: 'text-white' },
    { name: 'primary-DEFAULT', value: '#E30613', textColor: 'text-white' },
    { name: 'primary-light', value: '#FF3030', textColor: 'text-white' },
    { name: 'primary-dark', value: '#C00510', textColor: 'text-white' },
    { name: 'secondary-DEFAULT', value: '#4A545E', textColor: 'text-white' },
    { name: 'secondary-light', value: '#768595', textColor: 'text-white' },
    { name: 'secondary-dark', value: '#303740', textColor: 'text-white' },
  ]
  
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
    <div className="space-y-16">
      <div className="text-center">
        <h1 className="mb-6">Theming Guide</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Learn how to use and customize the Agilit-e Core theming system to match your brand identity and create consistent user experiences.
        </p>
      </div>
      
      {/* Dark Mode */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Dark Mode</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The Agilit-e Core library includes a complete dark mode implementation that automatically detects user preferences and persists their choice.
          </p>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          
          <div className="space-y-4">
            <p>
              The dark mode implementation works by adding a <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">dark</code> class to the <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">html</code> element. 
              This enables all the Tailwind dark mode variants (<code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">dark:bg-gray-900</code>, etc.).
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>
{`// Example component with dark mode support
const Card = () => (
  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-md shadow">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-gray-600 dark:text-gray-300">
      This card automatically adapts to dark mode.
    </p>
  </div>
);`}
                </code>
              </pre>
            </div>
            
            <p>
              The system also stores the user's preference in <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">localStorage</code> and 
              will detect system preferences using <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">prefers-color-scheme</code> media query.
            </p>
          </div>
          
          <h3 className="text-xl font-semibold mb-4 mt-8">Implementation</h3>
          
          <div className="space-y-4">
            <p>
              To implement dark mode in your application, add the <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">ThemeProvider</code> to your app's root component:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>
{`import { ThemeProvider } from './agilite-core';

const App = () => (
  <ThemeProvider>
    {/* Your app components */}
  </ThemeProvider>
);`}
                </code>
              </pre>
            </div>
            
            <p>
              Then add the <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">ThemeToggle</code> component in your navbar or settings to give users control:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>
{`import { ThemeToggle } from './agilite-core';

const Navbar = () => (
  <nav>
    {/* Other navbar items */}
    <ThemeToggle />
  </nav>
);`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>
      
      {/* Color System */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Color System</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Agilit-e Core comes with a predefined color palette based on the Agilit-e brand, which you can use directly or customize.
          </p>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Brand Colors</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {brandColors.map((color, index) => (
              <div key={index} className="rounded-md overflow-hidden shadow">
                <div 
                  className={`h-24 flex items-end p-3 ${color.textColor}`}
                  style={{ backgroundColor: color.value }}
                >
                  <div>
                    <div className="font-semibold">{color.name}</div>
                    <div className="text-sm opacity-90">{color.value}</div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-850 p-3 text-sm border-t dark:border-gray-700">
                  <code className="font-mono">
                    bg-{color.name}
                  </code>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Customizing Colors</h3>
          
          <p className="mb-4">
            You can customize the color palette by modifying the Tailwind configuration in your project.
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mb-6">
            <pre className="text-sm overflow-x-auto">
              <code>
{`// tailwind.config.js
const agiliteCore = require('./src/agilite-core/config/tailwind.config');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Extend the core theme
      ...agiliteCore.theme,
      // Override or add custom colors
      colors: {
        ...agiliteCore.theme.extend.colors,
        'custom-blue': '#0066FF',
        'agilite-red': '#DD0000', // Override the default red
      }
    }
  },
  plugins: []
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>
      
      {/* Utility Classes */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Utility Classes</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Agilit-e Core includes several utility classes built on top of Tailwind to speed up common development tasks.
          </p>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Available Utilities</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {utilityClasses.map((util, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'}>
                    <td className="px-4 py-4 text-sm font-mono text-agilite-red">{util.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{util.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h3 className="text-xl font-semibold mb-4 mt-8">Button Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <h4 className="text-lg font-medium mb-3">Usage</h4>
              <pre className="text-sm overflow-x-auto bg-gray-100 dark:bg-gray-850 p-3 rounded">
                <code>
{`<button className="btn-primary">
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
</button>`}
                </code>
              </pre>
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
        </div>
      </section>
      
      {/* Typography */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Typography</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Agilit-e Core defines consistent typography rules that automatically adjust for light and dark mode.
          </p>
        </div>
        
        <div className="p-6">
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
          
          <h3 className="text-xl font-semibold mb-4 mt-8">Font Family</h3>
          
          <p className="mb-4">
            The default font family is set to Inter with system fallbacks. You can customize this in the Tailwind configuration.
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
            <pre className="text-sm overflow-x-auto">
              <code>
{`fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['Inter', 'system-ui', 'sans-serif']
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ThemingGuide 