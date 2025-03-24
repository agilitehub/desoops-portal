import React from 'react'
import { Logo } from '../../../../index'

/**
 * Configuration for Logo component showcase
 */
const LogoConfig = {
  title: 'Logo',
  description: 'The Logo component with automatic dark mode support',
  usage: 'Logo',
  example: (
    <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8">
      <Logo size="small" />
      <Logo size="medium" />
      <Logo size="large" />
      <Logo size="medium" showText={false} />
      <Logo size="medium" variant="grayscale" />
    </div>
  ),
  codeExample: `
<Logo size="small" />
<Logo size="medium" /> {/* Default */}
<Logo size="large" />
<Logo showText={false} />
<Logo variant="grayscale" />
`,
  props: [
    { name: 'size', type: "'small' | 'medium' | 'large'", default: "'medium'", description: 'Controls the size of the logo' },
    { name: 'showText', type: 'boolean', default: 'true', description: 'Whether to show the text next to the logo' },
    { name: 'variant', type: "'color' | 'grayscale'", default: "'color'", description: 'The color variant of the logo (applies grayscale filter for grayscale)' },
    { name: 'textColor', type: 'string', default: "'text-agilite-slate'", description: 'TailwindCSS class for the text color (only for light mode, dark mode uses white)' },
    { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply' }
  ],
  notes: 'The Logo component automatically handles dark mode switching when used within a ThemeProvider context.'
}

export default LogoConfig 