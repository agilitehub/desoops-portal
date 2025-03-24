import React from 'react'
import { Logo } from '../../../../index'

/**
 * Configuration for Logo component showcase
 */
const LogoConfig = {
  title: "Logo",
  description: "The Logo component displays the Agilit-e brand logo, with support for both light and dark modes. It adapts sizes, supports variants, and can be displayed with or without text.",
  usage: "import { Logo } from './agilite-core';",
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
  notes: "The Logo component automatically switches between logo-default.png and logo-dark.png based on the current theme. Ensure both files exist in your public folder."
}

export default LogoConfig 