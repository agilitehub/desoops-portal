import React from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ComponentsShowcase from './pages/ComponentsShowcase'
import ThemingGuide from './pages/ThemingGuide'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'

/**
 * Main App component for the Agilit-e Core boilerplate demo
 * This demonstrates how to use the core components in a real application
 */
const BoilerplateApp = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Router>
          <Header />
          <main className="flex-grow container-padded py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/components" element={<ComponentsShowcase />} />
              <Route path="/theming" element={<ThemingGuide />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default BoilerplateApp 