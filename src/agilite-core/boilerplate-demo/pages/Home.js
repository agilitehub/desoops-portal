import React from 'react'
import { BackgroundEffect } from '../../index'
import { Hero, FeaturesSection, GettingStartedSection } from '../components/Home'

/**
 * Home page component for the boilerplate demo
 * Composed of multiple smaller components for better separation of concerns
 */
const Home = () => {
  return (
    <div className="relative">
      {/* Background effects using core component */}
      <BackgroundEffect className="opacity-50" />
      
      <div className="relative z-10">
        <Hero />
        <FeaturesSection />
        <GettingStartedSection />
      </div>
    </div>
  )
}

export default Home 