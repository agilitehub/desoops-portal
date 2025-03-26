import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faServer, 
  faCode, 
  faHeadset,
  faChartLine,
  faShieldHalved,
  faCoins,
  faUsers,
  faRocket
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
          The ultimate decentralized admin portal for DeSo creators—manage your community, distribute tokens, and scale your blockchain operations with enterprise-grade tools.
        </p>
        <p className="mx-auto max-w-4xl text-2xl font-medium text-deso-primary/80 dark:text-gray-200">
          Empower your DeSo projects with automated distribution systems, advanced holder management, and comprehensive analytics. Built by creators, for creators.
        </p>
        
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-8">
          <Link 
            to="/dashboard" 
            className="btn-primary inline-flex items-center text-xl font-semibold bg-deso-primary hover:bg-deso-blue text-white 
              px-10 py-5 rounded-lg transition-all duration-200 transform hover:scale-105 
              shadow-lg hover:shadow-xl"
          >
            <FontAwesomeIcon icon={faRocket} className="mr-4 text-2xl" />
            Launch Dashboard
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
            Get Support
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
              icon: faCoins,
              title: 'Token Distribution',
              description: 'Easily distribute $DESO, Creator Coins, and DAO Tokens to your holders. Support proportional or equal distribution with flexible targeting options.'
            },
            {
              icon: faUsers,
              title: 'Community Management',
              description: 'Advanced tools for managing coin holders, NFT owners, and supporters. Filter and segment your community based on holdings and engagement.'
            },
            {
              icon: faServer,
              title: 'Automated Operations',
              description: 'Set up automated distribution rules, manage holder rewards, and streamline your DeSo operations with our intuitive dashboard.'
            },
            {
              icon: faChartLine,
              title: 'Analytics & Insights',
              description: 'Track holder metrics, monitor token performance, and gain valuable insights into your community engagement and growth.'
            },
            {
              icon: faShieldHalved,
              title: 'Security & Control',
              description: 'Enterprise-grade security for your DeSo operations. Set conditions, manage permissions, and maintain full control over your distributions.'
            },
            {
              icon: faCode,
              title: 'Developer Tools',
              description: 'Built on modern tech stack including React 18, Redux, and the DeSo Protocol. Open-source and ready for customization.'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl p-6 
                shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700
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

      {/* Additional Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl p-8 
          shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-deso-primary dark:text-white">
            Why Choose DeSoOps?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-deso-primary dark:text-white">
                For Creators
              </h3>
              <ul className="space-y-3 text-deso-primary/80 dark:text-gray-200">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faChartLine} className="mt-1 mr-3 text-deso-accent" />
                  <span>Manage and reward your community with automated token distributions</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faUsers} className="mt-1 mr-3 text-deso-accent" />
                  <span>Target specific holder groups based on token ownership or engagement</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCoins} className="mt-1 mr-3 text-deso-accent" />
                  <span>Support for $DESO, Creator Coins, DAO Tokens, and NFT-based distributions</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-deso-primary dark:text-white">
                For Developers
              </h3>
              <ul className="space-y-3 text-deso-primary/80 dark:text-gray-200">
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faCode} className="mt-1 mr-3 text-deso-accent" />
                  <span>Built on React 18 with modern development practices</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faServer} className="mt-1 mr-3 text-deso-accent" />
                  <span>Open-source codebase ready for customization and extension</span>
                </li>
                <li className="flex items-start">
                  <FontAwesomeIcon icon={faRocket} className="mt-1 mr-3 text-deso-accent" />
                  <span>Comprehensive documentation and developer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero