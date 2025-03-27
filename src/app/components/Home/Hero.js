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
  faRocket,
  faWallet,
  faKey
} from '@fortawesome/free-solid-svg-icons'
import Video from './Video'
import desoLogo from '../../assets/deso-logo.png'

/**
 * Hero section for the DeSoOps landing page
 */
const Hero = () => {
  return (
    <div className="py-16">
      {/* Main Hero Section */}
      <div className="text-center mb-16 relative overflow-visible px-8">
        <div className="pt-20">
          <h1 className="mb-20 text-9xl transform scale-[2] font-extrabold tracking-tighter text-deso-primary dark:text-white 
            drop-shadow-[0_24px_48px_rgba(19,66,146,0.15)] dark:drop-shadow-[0_24px_48px_rgba(255,127,80,0.15)]
            max-w-[90vw] mx-auto">
            Welcome to <span className="text-deso-accent font-black dark:text-deso-light 
              bg-clip-text bg-gradient-to-r from-deso-accent via-deso-accent to-deso-accent/90">DeSoOps</span>
          </h1>
          <p className="mx-auto max-w-[95%] sm:max-w-[85%] md:max-w-[80%] text-8xl transform scale-[1.25] sm:scale-[1.35] md:scale-150 font-extrabold text-deso-primary/90 dark:text-white mb-16 leading-tight tracking-tight">
            The ultimate decentralized admin portal for DeSo creators—manage your community and distribute tokens.
          </p>
        </div>
        
        <div className="mt-14 flex flex-row justify-center gap-4 sm:gap-8 px-4 sm:px-0">
          <Link 
            to="/signin" 
            className="btn-primary inline-flex items-center text-base sm:text-xl font-extrabold bg-gradient-to-r from-[#FF7F50] via-[#FF6B3D] to-[#FF4500]
              px-4 sm:px-12 py-4 sm:py-6 rounded-lg transition-all duration-300 transform hover:scale-105 
              shadow-[0_8px_24px_rgba(255,127,80,0.3)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:from-[#FF7F50] dark:via-[#FF6B3D] dark:to-[#FF4500]
              dark:shadow-[0_8px_24px_rgba(255,127,80,0.3)] dark:hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              relative overflow-hidden group flex-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] animate-shimmer group-hover:translate-x-[100%] transition-transform duration-1000" />
            <img src={desoLogo} alt="DeSo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 group-hover:animate-bounce" />
            <span className="relative text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Sign in with DeSo</span>
          </Link>
          <Link 
            to="https://deso.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center text-base sm:text-xl font-extrabold bg-gradient-to-r from-[#FF7F50] via-[#FF6B3D] to-[#FF4500]
              px-4 sm:px-12 py-4 sm:py-6 rounded-lg transition-all duration-300 transform hover:scale-105 
              shadow-[0_8px_24px_rgba(255,127,80,0.3)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:from-[#FF7F50] dark:via-[#FF6B3D] dark:to-[#FF4500]
              dark:shadow-[0_8px_24px_rgba(255,127,80,0.3)] dark:hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              relative overflow-hidden group flex-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] animate-shimmer group-hover:translate-x-[100%] transition-transform duration-1000" />
            <img src={desoLogo} alt="DeSo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 group-hover:animate-bounce" />
            <span className="relative text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Create DeSo Account</span>
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
              title: 'Share Your Tokens',
              description: 'Send tokens to your supporters with just a few clicks. Perfect for rewarding your community members and growing your network.'
            },
            {
              icon: faUsers,
              title: 'NFT Holder Rewards',
              description: 'Automatically reward your NFT collectors and loyal supporters. Set up custom rewards to keep your community engaged and growing.'
            },
            {
              icon: faServer,
              title: 'Diamond Shower Rewards',
              description: 'Send diamond rewards to your favorite posts and creators. Easily target and reward engaging content from your community members.'
            },
            {
              icon: faChartLine,
              title: 'Poll Participant Rewards',
              description: 'Reward users who engage with your polls. Automatically distribute tokens to participants and increase community interaction.'
            },
            {
              icon: faShieldHalved,
              title: 'Deposit Notifications',
              description: 'Get instant notifications when tokens are sent to your account. Stay updated on all your incoming transactions in real-time.'
            },
            {
              icon: faCoins,
              title: 'Real-Time Crypto Values (Coming Soon)',
              description: 'Stay updated with live cryptocurrency prices and market trends. Track your DeSo assets and make informed decisions in real-time.'
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

      {/* User Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl p-8 
          shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center text-deso-primary dark:text-white">
            ⭐️ Voices of Success: DeSo Creators Share Their Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <FontAwesomeIcon icon={faWallet} className="text-deso-accent text-xl mt-1 mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                    Sarah K. | NFT Artist
                  </h3>
                  <p className="text-sm text-deso-accent dark:text-deso-light">Verified Creator</p>
                </div>
              </div>
              <p className="text-deso-primary/80 dark:text-gray-200 italic">
                "DeSoOps transformed how I manage my NFT drops. The automated distribution tools saved me countless hours, and my community engagement has never been better!"
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <FontAwesomeIcon icon={faKey} className="text-deso-accent text-xl mt-1 mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                    Alex M. | DAO Founder
                  </h3>
                  <p className="text-sm text-deso-accent dark:text-deso-light">Top Contributor</p>
                </div>
              </div>
              <p className="text-deso-primary/80 dark:text-gray-200 italic">
                "Running our DAO became 10x easier with DeSoOps. The analytics tools give us incredible insights, and token distribution is now seamless!"
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <FontAwesomeIcon icon={faRocket} className="text-deso-accent text-xl mt-1 mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                    Mike R. | Content Creator
                  </h3>
                  <p className="text-sm text-deso-accent dark:text-deso-light">Diamond Holder</p>
                </div>
              </div>
              <p className="text-deso-primary/80 dark:text-gray-200 italic">
                "The community management features are game-changing. I can now reward my most loyal supporters automatically. It's like having a full-time community manager!"
              </p>
            </div>
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <FontAwesomeIcon icon={faHeadset} className="text-deso-accent text-xl mt-1 mr-3" />
                <div>
                  <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                    Lisa T. | Tech Founder
                  </h3>
                  <p className="text-sm text-deso-accent dark:text-deso-light">Early Adopter</p>
                </div>
              </div>
              <p className="text-deso-primary/80 dark:text-gray-200 italic">
                "The developer tools are robust and well-documented. We built our entire token strategy on DeSoOps, and the results have been phenomenal!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero