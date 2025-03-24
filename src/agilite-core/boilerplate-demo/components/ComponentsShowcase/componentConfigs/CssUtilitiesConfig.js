import React from 'react'

/**
 * Configuration for CSS Utilities showcase
 */
const CssUtilitiesConfig = {
  title: 'CSS Utilities',
  description: 'Core CSS utilities for consistent styling across components',
  usage: 'Import from agilite-core/styles',
  codeExample: `
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
`,
  example: (
    <div className="p-8 flex flex-wrap items-center justify-center gap-4">
      <button className="btn-primary">Primary Button</button>
      <button className="btn-secondary">Secondary Button</button>
      <button className="btn-outline">Outline Button</button>
      <button className="btn-ghost">Ghost Button</button>
    </div>
  ),
  notes: 'These utility classes are part of the core CSS and follow the TailwindCSS semantic naming convention.',
  documentation: 'See styles/index.css for available utilities'
}

export default CssUtilitiesConfig 