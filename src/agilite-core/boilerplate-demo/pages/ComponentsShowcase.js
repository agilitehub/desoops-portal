import React from 'react'
import { ComponentSection, ShowcaseIntro, componentConfigs } from '../components/ComponentsShowcase'

/**
 * Component showcase page that demonstrates all available components
 * Composed of smaller, reusable components for better separation of concerns
 */
const ComponentsShowcase = () => {
  return (
    <div className="space-y-16">
      <ShowcaseIntro />
      
      {/* Render all component sections from config */}
      {componentConfigs.map((config, index) => (
        <ComponentSection
          key={index}
          title={config.title}
          description={config.description}
          usage={config.usage}
          example={config.example}
          codeExample={config.codeExample}
          props={config.props || []}
          notes={config.notes}
        />
      ))}
    </div>
  )
}

export default ComponentsShowcase 