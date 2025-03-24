import React from 'react'
import { Link } from 'react-router-dom'
import { InstructionStep, SectionTitle } from '../shared'

/**
 * Getting Started section with step-by-step instructions
 */
const GettingStartedSection = () => {
  const steps = [
    {
      title: 'Import components',
      description: 'Import any component or utility directly from the core library:',
      code: "import { Logo, ThemeToggle, BackgroundEffect, ThemeProvider } from './agilite-core';"
    },
    {
      title: 'Set up ThemeProvider',
      description: 'Wrap your application with the ThemeProvider for dark mode support:',
      code: `<ThemeProvider>
  <YourApp />
</ThemeProvider>`
    },
    {
      title: 'Add the theme toggle',
      description: 'Add the theme toggle component to let users switch between light and dark mode:',
      code: `<header>
  <nav>
    <ThemeToggle />
  </nav>
</header>`
    }
  ]

  return (
    <div className="py-16 bg-white dark:bg-gray-800 rounded-2xl p-8">
      <SectionTitle title="Getting Started" className="mb-8" />
      
      <div className="max-w-3xl mx-auto">
        <ol className="space-y-6 list-decimal list-inside ml-4">
          {steps.map((step, index) => (
            <InstructionStep
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              code={step.code}
            />
          ))}
        </ol>
        
        <div className="mt-10 text-center">
          <Link to="/components" className="btn-primary">
            Explore Components
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GettingStartedSection 