import React from 'react'
import { ThemeProvider } from '@/agilite-core/context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

/**
 * Main App component for the Agilit-e Core boilerplate demo
 * This demonstrates how to use the core components in a real application
 */
const App = () => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Router>
          <Header />
          <main className="flex-grow container-padded py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App 