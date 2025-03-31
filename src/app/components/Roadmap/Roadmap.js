import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PageLayout } from '../Layout'
import {
  faRocket,
  faLightbulb,
  faGears,
  faMobile,
  faShieldHalved,
  faChartLine,
  faCode,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

/**
 * Roadmap component that displays planned features and improvements
 */
const Roadmap = () => {
  const milestones = [
    {
      quarter: 'Q4 2024',
      status: 'in-progress',
      features: [
        {
          title: 'Enhanced Mobile Experience',
          description: 'Complete mobile app redesign with improved responsiveness and native-like experience',
          icon: faMobile,
          items: [
            'Optimized mobile interface',
            'Touch-friendly controls',
            'Improved navigation flow',
            'Better performance on mobile devices'
          ]
        },
        {
          title: 'Advanced Distribution Rules',
          description: 'More powerful and flexible distribution configuration options',
          icon: faGears,
          items: [
            'Custom distribution formulas',
            'Advanced filtering options',
            'Scheduled distributions',
            'Distribution templates'
          ]
        }
      ]
    },
    {
      quarter: 'Q1 2025',
      status: 'planned',
      features: [
        {
          title: 'Analytics Dashboard',
          description: 'Comprehensive analytics for tracking distributions and engagement',
          icon: faChartLine,
          items: [
            'Distribution analytics',
            'Engagement metrics',
            'Performance insights',
            'Custom reports'
          ]
        },
        {
          title: 'Enhanced Security Features',
          description: 'Advanced security options for safer token distributions',
          icon: faShieldHalved,
          items: [
            'Multi-signature support',
            'Advanced verification methods',
            'Enhanced privacy controls',
            'Security audit logs'
          ]
        }
      ]
    },
    {
      quarter: 'Q2 2025',
      status: 'planned',
      features: [
        {
          title: 'Smart Contract Integration',
          description: 'Advanced smart contract features for automated distributions',
          icon: faCode,
          items: [
            'Automated distribution triggers',
            'Smart contract templates',
            'Custom contract conditions',
            'Contract monitoring tools'
          ]
        },
        {
          title: 'AI-Powered Features',
          description: 'Intelligent automation and optimization capabilities',
          icon: faWandMagicSparkles,
          items: [
            'Smart distribution recommendations',
            'Automated optimization',
            'Predictive analytics',
            'AI-assisted configuration'
          ]
        }
      ]
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'planned':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
    }
  }

  const getStatusBadge = (status) => {
    const labels = {
      completed: 'Completed',
      'in-progress': 'In Progress',
      planned: 'Planned'
    }
    return labels[status] || status
  }

  return (
    <PageLayout>
      <div className="py-8 px-3 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 sm:mb-4 relative inline-block">
              <span className="absolute inset-0 blur-[0.5px]
                text-black/95 dark:text-white/95">
                Roadmap
              </span>
              <span className="relative bg-gradient-to-r from-[#FF4500] via-[#9333EA] to-[#3B82F6]
                dark:from-[#FF4500] dark:via-[#FF6B3D] dark:to-[#FFA500]
                bg-clip-text text-transparent animate-gradient font-black">
                Roadmap
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-deso-primary/80 dark:text-gray-300">
              Explore our vision and upcoming features
            </p>
          </div>

          {/* Timeline View */}
          <div className="relative">
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-deso-primary/20 to-deso-accent/20
              dark:from-deso-light/20 dark:to-deso-accent/20"></div>
            
            <div className="space-y-6 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.quarter} className="relative pl-8 sm:pl-16">
                  {/* Timeline Dot */}
                  <div className={`absolute left-3 sm:left-6 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 
                    ${getStatusColor(milestone.status)} bg-white dark:bg-deso-secondary
                    transform transition-transform duration-300`}>
                  </div>

                  {/* Quarter Label */}
                  <div className="mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-black relative inline-block">
                      <span className="absolute inset-0 blur-[0.5px]
                        text-black/90 dark:text-white/95">
                        {milestone.quarter}
                      </span>
                      <span className="relative bg-gradient-to-r from-[#FF4500] via-[#9333EA] to-[#3B82F6]
                        dark:from-[#FF4500] dark:via-[#FF6B3D] dark:to-[#FFA500]
                        bg-clip-text text-transparent">
                        {milestone.quarter}
                      </span>
                    </h2>
                    <span className={`ml-3 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(milestone.status)}`}>
                      {getStatusBadge(milestone.status)}
                    </span>
                  </div>

                  {/* Features Grid */}
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    {milestone.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/80 rounded-xl p-4 sm:p-6
                          shadow-[0_8px_16px_rgba(255,69,0,0.2),0_4px_8px_rgba(147,51,234,0.2),0_2px_4px_rgba(59,130,246,0.2)]
                          hover:shadow-[0_32px_64px_rgba(255,69,0,0.25),0_16px_32px_rgba(147,51,234,0.3),0_8px_16px_rgba(59,130,246,0.35)]
                          dark:shadow-[0_8px_16px_rgba(255,69,0,0.25),0_4px_8px_rgba(255,107,61,0.2)]
                          dark:hover:shadow-[0_32px_64px_rgba(255,69,0,0.3),0_16px_32px_rgba(255,107,61,0.35),0_8px_16px_rgba(255,165,0,0.4)]
                          transition-all duration-500 ease-out transform hover:scale-[1.01] hover:-translate-y-1
                          relative overflow-hidden group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`${getStatusColor(milestone.status)} p-2 sm:p-3 rounded-lg
                            bg-opacity-10 dark:bg-opacity-20 flex-shrink-0 transform transition-transform duration-300
                            group-hover:scale-110`}>
                            <FontAwesomeIcon icon={feature.icon} className="text-xl sm:text-2xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-deso-primary dark:text-white">
                              {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base mb-4 text-deso-primary/70 dark:text-gray-300">
                              {feature.description}
                            </p>
                            <ul className="space-y-2">
                              {feature.items.map((item, itemIndex) => (
                                <li
                                  key={itemIndex}
                                  className="flex items-start gap-2 text-sm sm:text-base text-deso-primary/80 dark:text-gray-300"
                                >
                                  <span className="text-deso-accent dark:text-deso-light mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Roadmap 