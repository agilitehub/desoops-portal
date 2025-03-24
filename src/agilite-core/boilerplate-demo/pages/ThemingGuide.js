import React from 'react'
import {
  ThemingIntro,
  DarkModeSection,
  ColorSystemSection,
  UtilityClassesSection,
  TypographySection
} from '../components/ThemingGuide'

/**
 * Theming Guide page that explains how to use and customize theming
 * Composed of smaller, reusable components for better separation of concerns
 */
const ThemingGuide = () => {
  return (
    <div className="space-y-16">
      <ThemingIntro />
      <DarkModeSection />
      <ColorSystemSection />
      <UtilityClassesSection />
      <TypographySection />
    </div>
  )
}

export default ThemingGuide 