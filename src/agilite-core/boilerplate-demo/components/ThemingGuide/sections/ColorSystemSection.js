import React from 'react'
import ThemeSection from '../ThemeSection'
import SubSection from '../SubSection'
import CodeSnippet from '../CodeSnippet'
import ColorSwatch from '../ColorSwatch'

/**
 * Color System section of the theming guide
 */
const ColorSystemSection = () => {
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

  return (
    <ThemeSection
      title="Color System"
      description="Agilit-e Core comes with a predefined color palette based on the Agilit-e brand, which you can use directly or customize."
    >
      <SubSection title="Brand Colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {brandColors.map((color, index) => (
            <ColorSwatch key={index} color={color} />
          ))}
        </div>
      </SubSection>
      
      <SubSection title="Customizing Colors">
        <p className="mb-4">
          You can customize the color palette by modifying the Tailwind configuration in your project.
        </p>
        
        <CodeSnippet code={`// tailwind.config.js
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
}`} />
      </SubSection>
    </ThemeSection>
  )
}

export default ColorSystemSection 