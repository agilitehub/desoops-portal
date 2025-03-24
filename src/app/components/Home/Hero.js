import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faServer, 
  faCode, 
  faWrench, 
  faHeadset,
  faChartLine,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import Video from './Video'

/**
 * Hero section for the DeSo Ops landing page
 */
const Hero = () => {
  return (
    <div className="py-16">
      {/* Main Hero Section */}
      <div className="text-center mb-16">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-deso-primary dark:text-white drop-shadow-[0_8px_16px_rgba(19,66,146,0.5)] dark:drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)]">
          Welcome to <span className="text-deso-accent dark:text-deso-light drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)] dark:drop-shadow-[0_8px_16px_rgba(100,190,255,0.6)]">DeSoOps</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300 mb-4 drop-shadow-[0_4px_8px_rgba(19,66,146,0.4)] dark:drop-shadow-[0_4px_8px_rgba(100,190,255,0.5)]">
          Your comprehensive toolkit for building and managing on the DeSo blockchain—the ultimate control room for decentralized social operations.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300 drop-shadow-[0_4px_8px_rgba(19,66,146,0.4)] dark:drop-shadow-[0_4px_8px_rgba(100,190,255,0.5)]">
          Web2 gave us convenience but stole our data. Web3 promises ownership—but often forgets usability. We're here to bridge that gap with enterprise-grade infrastructure for the decentralized web.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            to="/get-started" 
            className="btn-primary inline-flex items-center text-base bg-deso-primary hover:bg-deso-blue text-white 
              px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 
              shadow-[0_8px_24px_rgba(19,66,146,0.5)] hover:shadow-[0_12px_32px_rgba(19,66,146,0.6)]
              dark:bg-deso-light dark:hover:bg-deso-dodger dark:shadow-[0_8px_24px_rgba(100,190,255,0.5)] dark:hover:shadow-[0_12px_32px_rgba(100,190,255,0.6)]"
          >
            <FontAwesomeIcon icon={faCode} className="mr-2" />
            Start Building
          </Link>
          <Link 
            to="/about" 
            className="btn-outline inline-flex items-center text-base border-2 border-deso-primary text-deso-primary 
              hover:bg-deso-primary hover:text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105
              shadow-[0_8px_24px_rgba(255,127,80,0.4)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:border-deso-light dark:text-deso-light dark:hover:bg-deso-light dark:hover:text-deso-dark"
          >
            <FontAwesomeIcon icon={faShieldHalved} className="mr-2" />
            Learn More
          </Link>
          <Link 
            to="/contact" 
            className="btn-outline inline-flex items-center text-base border-2 border-deso-primary text-deso-primary 
              hover:bg-deso-primary hover:text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105
              shadow-[0_8px_24px_rgba(255,127,80,0.4)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:border-deso-light dark:text-deso-light dark:hover:bg-deso-light dark:hover:text-deso-dark"
          >
            <FontAwesomeIcon icon={faHeadset} className="mr-2" />
            Get Consultation
          </Link>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative mb-16">
        <Video />
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          {[
            {
              icon: faServer,
              title: 'Node Management',
              description: 'Comprehensive node operations including automated upgrades, monitoring, backups, and log management. Your DeSo infrastructure, simplified.'
            },
            {
              icon: faWrench,
              title: 'Infrastructure Support',
              description: 'Enterprise-grade blockchain infrastructure support—like AWS for decentralized social. Perfect for teams building DeSo-powered applications.'
            },
            {
              icon: faCode,
              title: 'Developer Services',
              description: 'Access to robust API endpoints, sandbox environments, and testing tools. Build and test your DeSo apps without managing infrastructure.'
            },
            {
              icon: faShieldHalved,
              title: 'Custom Deployments',
              description: 'Tailored DeSo solutions for businesses and power users. Get a fully customized deployment that matches your specific needs.'
            },
            {
              icon: faHeadset,
              title: 'Expert Support',
              description: 'Hands-on support and consulting for teams new to Web3. Like having a dedicated Web3 IT team on speed dial.'
            },
            {
              icon: faChartLine,
              title: 'Success Stories',
              description: 'Powering major platforms like OpenProsper, DAODAO, and Social World. Join the growing ecosystem of successful DeSo projects.'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-6 
                shadow-[0_12px_32px_rgba(19,66,146,0.25)] hover:shadow-[0_16px_48px_rgba(19,66,146,0.35)]
                dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)] dark:hover:shadow-[0_16px_48px_rgba(100,190,255,0.35)]
                transition-all duration-200 transform hover:scale-105 hover:rotate-1"
            >
              <div className="text-deso-accent dark:text-deso-light mb-4 drop-shadow-[0_4px_8px_rgba(255,127,80,0.5)] dark:drop-shadow-[0_4px_8px_rgba(100,190,255,0.6)]">
                <FontAwesomeIcon icon={feature.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-deso-primary dark:text-white drop-shadow-[0_4px_8px_rgba(19,66,146,0.4)] dark:drop-shadow-[0_4px_8px_rgba(100,190,255,0.5)]">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero