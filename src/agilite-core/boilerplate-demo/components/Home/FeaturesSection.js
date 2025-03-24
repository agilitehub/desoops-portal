import React from 'react'
import { FeatureCard, SectionTitle } from '../shared'

/**
 * Features section showing key benefits of the core library
 */
const FeaturesSection = () => {
  const features = [
    {
      number: '1',
      title: 'Reusable Components',
      description: 'Pre-built UI components like logos, theme toggles, and background effects that can be easily imported and used in any React application.'
    },
    {
      number: '2',
      title: 'Dark Mode Support',
      description: 'Built-in theme context provides easy dark/light mode switching with localStorage persistence and system preference detection.'
    },
    {
      number: '3',
      title: 'Tailwind Integration',
      description: 'Custom Tailwind configuration with brand colors, animations, and reusable utility classes for consistent styling across projects.'
    }
  ]

  return (
    <div className="py-16">
      <SectionTitle title="Core Features" />
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            number={feature.number}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturesSection 