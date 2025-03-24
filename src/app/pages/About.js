import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faServer, 
  faCode, 
  faWrench, 
  faHeadset,
  faChartLine,
  faShieldHalved,
  faRocket,
  faHeart
} from '@fortawesome/free-solid-svg-icons'
import PageLayout from '../components/Layout/PageLayout'

const About = () => {
  return (
    <PageLayout>
      <div className="container-padded py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-deso-primary dark:text-white drop-shadow-[0_8px_16px_rgba(19,66,146,0.5)] dark:drop-shadow-[0_8px_16px_rgba(255,127,80,0.5)]">
            About <span className="text-deso-accent dark:text-deso-light">DeSoOps</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300 mb-4">
            We're the infrastructure backbone of the decentralized social revolution.
          </p>
        </div>

        {/* Who We Are Section */}
        <div className="mb-16">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
            shadow-[0_12px_32px_rgba(19,66,146,0.25)]
            dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]">
            <h2 className="text-3xl font-bold mb-6 text-deso-primary dark:text-white">Who We Are</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We provide robust, scalable, and secure operational support for builders, creators, and innovators building on the DeSo Blockchain—the first layer-1 blockchain purpose-built for social media.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our mission? To make building and scaling decentralized apps (dApps) as smooth and reliable as traditional platforms—without sacrificing the freedom, ownership, and transparency that Web3 promises.
            </p>
          </div>
        </div>

        {/* Meet the Founder Section */}
        <div className="mb-16">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
            shadow-[0_12px_32px_rgba(19,66,146,0.25)]
            dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-deso-primary dark:text-white">Meet the Founder – @JohnJardin</h2>
              <FontAwesomeIcon icon={faHeart} className="ml-4 text-deso-accent dark:text-deso-light text-2xl" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              DeSoOps was founded by John Jardin, a visionary developer and systems architect with a heart for decentralized tech and a brain wired for clean, resilient infrastructure. A longtime believer in the potential of blockchain to change how we connect and create, John saw that while the DeSo ecosystem was full of potential, it lacked the backend support to help builders truly thrive.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              So—he built it.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Armed with years of experience in devops, cloud engineering, and decentralized architecture, John created DeSoOps to be the infrastructure lifeline for creators, developers, and entrepreneurs stepping into Web3.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              His code is tight, his uptime is spotless, and his vision? Future-facing, freedom-first, and fiercely creator-driven.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 italic">
              (And yes, he also happens to be the sweetheart of someone who believes in him almost as much as he believes in open protocols. 🥰)
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-deso-primary dark:text-white">What We Do</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
            Whether you're launching a node, building a DeSo-native app, or need white-glove support to keep things running 24/7—we've got your back.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: faServer,
                title: 'Node Management & Hosting',
                description: 'Spin up full DeSo nodes with automatic updates, backups, and real-time monitoring. Set it and forget it.'
              },
              {
                icon: faWrench,
                title: 'Custom Deployments',
                description: 'Tailored infrastructure setups for businesses, communities, or creators looking to control their entire decentralized stack.'
              },
              {
                icon: faCode,
                title: 'Developer Tools',
                description: 'APIs, sandboxes, testnets, and technical support to help you build, break, and build again—fast.'
              },
              {
                icon: faHeadset,
                title: 'Consulting & Support',
                description: 'From idea to launch (and every bug fix in between), we partner with you to bring your vision to life—on-chain and unstoppable.'
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-6 
                  shadow-[0_12px_32px_rgba(19,66,146,0.25)] hover:shadow-[0_16px_48px_rgba(19,66,146,0.35)]
                  dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)] dark:hover:shadow-[0_16px_48px_rgba(100,190,255,0.35)]
                  transition-all duration-200 transform hover:scale-105 hover:rotate-1"
              >
                <div className="text-deso-accent dark:text-deso-light mb-4">
                  <FontAwesomeIcon icon={service.icon} className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-deso-primary dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-deso-primary dark:text-white">Who We Work With</h2>
          <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
            shadow-[0_12px_32px_rgba(19,66,146,0.25)]
            dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We're proud to support some of the most forward-thinking projects in the DeSo ecosystem, including:
            </p>
            <ul className="list-none space-y-4 mb-6">
              <li className="flex items-center text-lg text-gray-600 dark:text-gray-300">
                <FontAwesomeIcon icon={faChartLine} className="text-deso-accent dark:text-deso-light mr-3" />
                <strong>OpenProsper</strong> - blockchain analytics
              </li>
              <li className="flex items-center text-lg text-gray-600 dark:text-gray-300">
                <FontAwesomeIcon icon={faShieldHalved} className="text-deso-accent dark:text-deso-light mr-3" />
                <strong>DAODAO</strong> - crowdfunding and DAO tools
              </li>
              <li className="flex items-center text-lg text-gray-600 dark:text-gray-300">
                <FontAwesomeIcon icon={faRocket} className="text-deso-accent dark:text-deso-light mr-3" />
                <strong>Social World</strong> - decentralized social networking
              </li>
            </ul>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              If you're building on DeSo, you're in good company.
            </p>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mb-16">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-deso-secondary/50 rounded-xl p-8 
            shadow-[0_12px_32px_rgba(19,66,146,0.25)]
            dark:shadow-[0_12px_32px_rgba(100,190,255,0.25)]">
            <h2 className="text-3xl font-bold mb-6 text-deso-primary dark:text-white">Why It Matters</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Web2 gave us convenience but stole our data. Web3 promises ownership—but often forgets usability. We're here to bridge that gap.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              With DeSoOps, you get the reliability of traditional cloud infrastructure—on a blockchain that actually gives a damn about creators and communities.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-deso-primary dark:text-white">Let's Build Together</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Whether you're a solo dev, a DAO, or a business exploring the decentralized frontier, DeSoOps is your launchpad.
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/contact" 
              className="btn-primary inline-flex items-center text-base bg-deso-primary hover:bg-deso-blue text-white 
                px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 
                shadow-[0_8px_24px_rgba(19,66,146,0.5)] hover:shadow-[0_12px_32px_rgba(19,66,146,0.6)]
                dark:bg-deso-light dark:hover:bg-deso-dodger dark:shadow-[0_8px_24px_rgba(100,190,255,0.5)] dark:hover:shadow-[0_12px_32px_rgba(100,190,255,0.6)]"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default About 