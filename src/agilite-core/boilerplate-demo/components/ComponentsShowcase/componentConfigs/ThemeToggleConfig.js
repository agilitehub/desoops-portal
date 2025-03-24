import React from 'react'
import { ThemeToggle } from '../../../../index'

/**
 * Configuration for ThemeToggle component showcase
 */
const ThemeToggleConfig = {
  title: "ThemeToggle",
  description: "The ThemeToggle component provides a toggle switch for users to switch between light and dark modes. It works in conjunction with the ThemeProvider context.",
  usage: "import { ThemeToggle, ThemeProvider } from './agilite-core';",
  example: (
    <div className="p-8 flex items-center justify-center">
      <ThemeToggle />
    </div>
  ),
  codeExample: `
// In your main App component:
<ThemeProvider>
  <App />
</ThemeProvider>

// In your header/navbar:
<ThemeToggle />
`,
  props: [
    { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply' }
  ],
  notes: "The ThemeToggle component must be used within a ThemeProvider context. It automatically stores the user's preference in localStorage and respects the user's system preference."
}

export default ThemeToggleConfig 