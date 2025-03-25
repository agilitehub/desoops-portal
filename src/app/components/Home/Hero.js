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
        <h1 className="mb-8 text-7xl font-bold tracking-tight text-deso-primary dark:text-white">
          Welcome to <span className="text-deso-accent font-extrabold dark:text-deso-light">DeSoOps</span>
        </h1>
        <p className="mx-auto max-w-4xl text-3xl font-medium text-deso-primary/90 dark:text-white mb-8">
          Your comprehensive toolkit for building and managing on the DeSo blockchain—the ultimate control room for decentralized social operations.
        </p>
        <p className="mx-auto max-w-4xl text-2xl font-medium text-deso-primary/80 dark:text-gray-200">
          Web2 gave us convenience but stole our data. Web3 promises ownership—but often forgets usability. We're here to bridge that gap with enterprise-grade infrastructure for the decentralized web.
        </p>
        
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-8">
          <Link 
            to="/get-started" 
            className="btn-primary inline-flex items-center text-xl font-semibold bg-deso-primary hover:bg-deso-blue text-white 
              px-10 py-5 rounded-lg transition-all duration-200 transform hover:scale-105 
              shadow-lg hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faCode} className="mr-4 text-2xl" />
            Start Building
          </Link>
          <Link 
            to="/about" 
            className="btn-outline inline-flex items-center text-xl font-semibold border-2 border-deso-primary text-deso-primary 
              hover:bg-deso-primary hover:text-white px-10 py-5 rounded-lg transition-all duration-200 transform hover:scale-105
              shadow-lg hover:shadow-xl
              dark:border-deso-light dark:text-deso-light dark:hover:bg-deso-light dark:hover:text-deso-dark"
          >
            <FontAwesomeIcon icon={faShieldHalved} className="mr-4 text-2xl" />
            Learn More
          </Link>
          <Link 
            to="/contact" 
            className="btn-outline inline-flex items-center text-xl font-semibold border-2 border-deso-primary text-deso-primary 
              hover:bg-deso-primary hover:text-white px-10 py-5 rounded-lg transition-all duration-200 transform hover:scale-105
              shadow-lg hover:shadow-xl
              dark:border-deso-light dark:text-deso-light dark:hover:bg-deso-light dark:hover:text-deso-dark"
          >
            <FontAwesomeIcon icon={faHeadset} className="mr-4 text-2xl" />
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
              className="bg-white dark:bg-deso-secondary rounded-xl p-6 
                shadow-lg hover:shadow-xl
                transition-all duration-200 transform hover:scale-105 hover:rotate-1"
            >
              <div className="text-deso-accent dark:text-deso-light mb-4">
                <FontAwesomeIcon icon={feature.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-deso-primary dark:text-white">
                {feature.title}
              </h3>
              <p className="text-deso-primary/80 dark:text-gray-200 font-medium">
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