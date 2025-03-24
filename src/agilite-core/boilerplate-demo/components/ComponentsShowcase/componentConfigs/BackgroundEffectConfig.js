import React from 'react'
import { BackgroundEffect } from '../../../../index'

/**
 * Configuration for BackgroundEffect component showcase
 */
const BackgroundEffectConfig = {
  title: "BackgroundEffect",
  description: "The BackgroundEffect component adds a decorative background with subtle animations and gradients. It automatically adjusts for light and dark modes.",
  usage: "import { BackgroundEffect } from './agilite-core';",
  example: (
    <div className="relative h-64 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <BackgroundEffect />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-center font-medium">Content appears on top of the background</p>
        </div>
      </div>
    </div>
  ),
  codeExample: `
<div className="relative">
  <BackgroundEffect />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
`,
  props: [
    { name: 'className', type: 'string', default: "''", description: 'Additional CSS classes to apply (e.g., "opacity-50" for a more subtle effect)' }
  ],
  notes: "The BackgroundEffect component should be used within a relative positioned container with your content having a higher z-index."
}

export default BackgroundEffectConfig 