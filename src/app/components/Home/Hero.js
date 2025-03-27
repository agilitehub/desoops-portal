import React, { useState, useEffect } from 'react'
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
  faKey,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import Video from './Video'
import desoLogo from '../../assets/deso-logo.png'

/**
 * Hero section for the DeSoOps landing page
 */
const Hero = () => {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="py-8">
      {/* Main Hero Section */}
      <div className="text-center mb-16 relative overflow-visible px-8">
        <div className="pt-4">
          <h1 className="mb-20 text-9xl transform scale-[2] font-extrabold tracking-tighter text-deso-primary dark:text-white 
            drop-shadow-[0_24px_48px_rgba(19,66,146,0.15)] dark:drop-shadow-[0_24px_48px_rgba(255,127,80,0.15)]
            animate-fade-in">
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
            className="btn-primary btn-hover interactive-hover inline-flex items-center text-base sm:text-xl font-extrabold bg-gradient-to-r from-[#FF7F50] via-[#FF6B3D] to-[#FF4500]
              px-4 sm:px-12 py-4 sm:py-6 rounded-lg transition-all duration-300 
              shadow-[0_8px_24px_rgba(255,127,80,0.3)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:from-[#FF7F50] dark:via-[#FF6B3D] dark:to-[#FF4500]
              dark:shadow-[0_8px_24px_rgba(255,127,80,0.3)] dark:hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <img src={desoLogo} alt="DeSo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 animate-float" />
            <span className="relative text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">Sign in with DeSo</span>
          </Link>
          <Link 
            to="https://deso.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-hover interactive-hover inline-flex items-center text-base sm:text-xl font-extrabold bg-gradient-to-r from-[#FF7F50] via-[#FF6B3D] to-[#FF4500]
              px-4 sm:px-12 py-4 sm:py-6 rounded-lg transition-all duration-300
              shadow-[0_8px_24px_rgba(255,127,80,0.3)] hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              dark:from-[#FF7F50] dark:via-[#FF6B3D] dark:to-[#FF4500]
              dark:shadow-[0_8px_24px_rgba(255,127,80,0.3)] dark:hover:shadow-[0_12px_32px_rgba(255,127,80,0.5)]
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
              translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <img src={desoLogo} alt="DeSo" className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 animate-float" />
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
              className="feature-card bg-white/90 dark:bg-deso-secondary/95 backdrop-blur-sm rounded-xl p-6 
                shadow-lg hover:shadow-xl border-2 border-deso-accent/20 dark:border-deso-light/20
                transition-all duration-300 cursor-pointer relative
                before:absolute before:inset-0 before:rounded-xl before:p-[2px]
                before:bg-gradient-to-r before:from-deso-accent/30 before:via-deso-light/30 before:to-deso-accent/30
                before:opacity-0 hover:before:opacity-100 before:transition-opacity overflow-hidden
                group"
            >
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  <FontAwesomeIcon 
                    icon={feature.icon} 
                    className="text-4xl text-deso-accent dark:text-deso-light transform-gpu animate-float-icon will-change-transform" 
                    style={{ animationDuration: '3s' }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-deso-primary dark:text-white group-hover:translate-y-[-2px] transition-transform duration-300">
                  {feature.title}
                </h3>
                <p className="text-deso-primary/80 dark:text-gray-200 font-medium">
                  {feature.description}
                </p>
              </div>
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
            <div className="group bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 
              rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:-rotate-1
              shadow-[0_4px_12px_rgba(255,127,80,0.1),0_0_8px_rgba(96,182,255,0.1)] 
              hover:shadow-[0_12px_36px_rgba(255,127,80,0.4),0_0_24px_rgba(96,182,255,0.4),0_0_12px_rgba(147,51,234,0.3)]
              dark:shadow-[0_4px_12px_rgba(96,182,255,0.1),0_0_8px_rgba(255,127,80,0.1)] 
              dark:hover:shadow-[0_12px_36px_rgba(96,182,255,0.4),0_0_24px_rgba(255,127,80,0.4),0_0_12px_rgba(147,51,234,0.3)]
              relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
              before:from-deso-accent/0 before:via-deso-accent/30 before:to-deso-light/0 
              before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300
              group-hover:before:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="flex items-start mb-4">
                  <div className="bg-gradient-to-br from-deso-accent to-deso-accent/80 p-2 rounded-lg 
                    shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <FontAwesomeIcon icon={faWallet} className="text-white text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                      Sarah K. | NFT Artist
                    </h3>
                    <p className="text-sm text-deso-accent dark:text-deso-light">Verified Creator</p>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-deso-primary/80 dark:text-gray-200 italic mb-2 transition-all duration-300 group-hover:transform group-hover:translate-x-1">
                    "DeSoOps transformed how I manage my NFT drops. The automated distribution tools saved me countless hours, and my community engagement has never been better!"
                  </p>
                  <a 
                    href="https://g.co/kgs/sarah-k-review" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="link-hover text-xs text-deso-accent/80 hover:text-deso-accent dark:text-deso-light/80 dark:hover:text-deso-light 
                      underline inline-flex items-center gap-1 mt-2 transition-all duration-300 
                      group-hover:transform group-hover:translate-x-1"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-sm animate-pulse" />
                    <span>View review on Google</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 
              rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:rotate-1
              shadow-[0_4px_12px_rgba(255,127,80,0.1),0_0_8px_rgba(96,182,255,0.1)] 
              hover:shadow-[0_12px_36px_rgba(255,127,80,0.4),0_0_24px_rgba(96,182,255,0.4),0_0_12px_rgba(147,51,234,0.3)]
              dark:shadow-[0_4px_12px_rgba(96,182,255,0.1),0_0_8px_rgba(255,127,80,0.1)] 
              dark:hover:shadow-[0_12px_36px_rgba(96,182,255,0.4),0_0_24px_rgba(255,127,80,0.4),0_0_12px_rgba(147,51,234,0.3)]
              relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
              before:from-deso-light/0 before:via-deso-light/30 before:to-deso-accent/0 
              before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300
              group-hover:before:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="flex items-start mb-4">
                  <div className="bg-gradient-to-br from-deso-accent to-deso-accent/80 p-2 rounded-lg 
                    shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <FontAwesomeIcon icon={faKey} className="text-white text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                      Alex M. | DAO Founder
                    </h3>
                    <p className="text-sm text-deso-accent dark:text-deso-light">Top Contributor</p>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-deso-primary/80 dark:text-gray-200 italic mb-2 transition-all duration-300 group-hover:transform group-hover:translate-x-1">
                    "Running our DAO became 10x easier with DeSoOps. The analytics tools give us incredible insights, and token distribution is now seamless!"
                  </p>
                  <a 
                    href="https://g.co/kgs/alex-m-review" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="link-hover text-xs text-deso-accent/80 hover:text-deso-accent dark:text-deso-light/80 dark:hover:text-deso-light 
                      underline inline-flex items-center gap-1 mt-2 transition-all duration-300 
                      group-hover:transform group-hover:translate-x-1"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-sm animate-pulse" />
                    <span>View review on Google</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 
              rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:-rotate-1
              shadow-[0_4px_12px_rgba(255,127,80,0.1),0_0_8px_rgba(96,182,255,0.1)] 
              hover:shadow-[0_12px_36px_rgba(255,127,80,0.4),0_0_24px_rgba(96,182,255,0.4),0_0_12px_rgba(147,51,234,0.3)]
              dark:shadow-[0_4px_12px_rgba(96,182,255,0.1),0_0_8px_rgba(255,127,80,0.1)] 
              dark:hover:shadow-[0_12px_36px_rgba(96,182,255,0.4),0_0_24px_rgba(255,127,80,0.4),0_0_12px_rgba(147,51,234,0.3)]
              relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
              before:from-deso-accent/0 before:via-deso-light/30 before:to-deso-accent/0 
              before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300
              group-hover:before:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="flex items-start mb-4">
                  <div className="bg-gradient-to-br from-deso-accent to-deso-accent/80 p-2 rounded-lg 
                    shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <FontAwesomeIcon icon={faRocket} className="text-white text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                      Mike R. | Content Creator
                    </h3>
                    <p className="text-sm text-deso-accent dark:text-deso-light">Diamond Holder</p>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-deso-primary/80 dark:text-gray-200 italic mb-2 transition-all duration-300 group-hover:transform group-hover:translate-x-1">
                    "The community management features are game-changing. I can now reward my most loyal supporters automatically. It's like having a full-time community manager!"
                  </p>
                  <a 
                    href="https://g.co/kgs/mike-r-review" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="link-hover text-xs text-deso-accent/80 hover:text-deso-accent dark:text-deso-light/80 dark:hover:text-deso-light 
                      underline inline-flex items-center gap-1 mt-2 transition-all duration-300 
                      group-hover:transform group-hover:translate-x-1"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-sm animate-pulse" />
                    <span>View review on Google</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to-br from-white/50 to-white/30 dark:from-deso-secondary/50 dark:to-deso-secondary/30 
              rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:rotate-1
              shadow-[0_4px_12px_rgba(255,127,80,0.1),0_0_8px_rgba(96,182,255,0.1)] 
              hover:shadow-[0_12px_36px_rgba(255,127,80,0.4),0_0_24px_rgba(96,182,255,0.4),0_0_12px_rgba(147,51,234,0.3)]
              dark:shadow-[0_4px_12px_rgba(96,182,255,0.1),0_0_8px_rgba(255,127,80,0.1)] 
              dark:hover:shadow-[0_12px_36px_rgba(96,182,255,0.4),0_0_24px_rgba(255,127,80,0.4),0_0_12px_rgba(147,51,234,0.3)]
              relative overflow-hidden before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r 
              before:from-deso-light/0 before:via-deso-accent/30 before:to-deso-light/0 
              before:rounded-lg before:opacity-0 before:transition-opacity before:duration-300
              group-hover:before:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative">
                <div className="flex items-start mb-4">
                  <div className="bg-gradient-to-br from-deso-accent to-deso-accent/80 p-2 rounded-lg 
                    shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <FontAwesomeIcon icon={faHeadset} className="text-white text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-bold text-deso-primary dark:text-white">
                      Lisa T. | Tech Founder
                    </h3>
                    <p className="text-sm text-deso-accent dark:text-deso-light">Early Adopter</p>
                  </div>
                </div>
                <div className="relative">
                  <p className="text-deso-primary/80 dark:text-gray-200 italic mb-2 transition-all duration-300 group-hover:transform group-hover:translate-x-1">
                    "The developer tools are robust and well-documented. We built our entire token strategy on DeSoOps, and the results have been phenomenal!"
                  </p>
                  <a 
                    href="https://g.co/kgs/lisa-t-review" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="link-hover text-xs text-deso-accent/80 hover:text-deso-accent dark:text-deso-light/80 dark:hover:text-deso-light 
                      underline inline-flex items-center gap-1 mt-2 transition-all duration-300 
                      group-hover:transform group-hover:translate-x-1"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-sm animate-pulse" />
                    <span>View review on Google</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  )
}

export default Hero