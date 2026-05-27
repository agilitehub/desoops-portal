import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faUsers,
  faServer,
  faChartLine,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'

const FEATURES = [
  {
    icon: faCoins,
    title: 'Share Your Tokens',
    description:
      'Send tokens to your supporters with just a few clicks. Perfect for rewarding your community members and growing your network.'
  },
  {
    icon: faUsers,
    title: 'NFT Holder Rewards',
    description:
      'Automatically reward your NFT collectors and loyal supporters. Set up custom rewards to keep your community engaged and growing.'
  },
  {
    icon: faServer,
    title: 'Diamond Shower Rewards',
    description:
      'Send diamond rewards to your favorite posts and creators. Easily target and reward engaging content from your community members.'
  },
  {
    icon: faChartLine,
    title: 'Poll Participant Rewards',
    description:
      'Reward users who engage with your polls. Automatically distribute tokens to participants and increase community interaction.'
  },
  {
    icon: faShieldHalved,
    title: 'Deposit Notifications',
    description:
      'Get instant notifications when tokens are sent to your account. Stay updated on all your incoming transactions in real-time.'
  },
  {
    icon: faCoins,
    title: 'Real-Time Crypto Values (Coming Soon)',
    description:
      'Stay updated with live cryptocurrency prices and market trends. Track your DeSo assets and make informed decisions in real-time.'
  }
]

const LoginFeaturesGrid = () => (
  <section className='mx-auto mt-8 w-full' aria-labelledby='login-features-heading'>
    <h2 id='login-features-heading' className='mb-10 text-center text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold leading-tight text-deso-blue-deep'>
      Powerful Features for DeSo Creators
    </h2>
    <div className='mx-auto grid w-full grid-cols-1 gap-[18px] md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8'>
      {FEATURES.map((feature) => (
        <article
          key={feature.title}
          className='rounded-xl border-2 border-deso-orange/40 bg-white/95 p-[18px_22px_20px] text-left shadow-[0_4px_12px_rgba(28,75,115,0.08)] transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(28,75,115,0.12)]'
        >
          <div className='mb-3 flex justify-center text-[1.75rem] text-deso-orange'>
            <FontAwesomeIcon icon={feature.icon} />
          </div>
          <h3 className='mb-1.5 text-lg font-bold leading-snug text-foreground'>{feature.title}</h3>
          <p className='m-0 text-[0.9375rem] font-medium leading-[1.45] text-foreground/85'>{feature.description}</p>
        </article>
      ))}
    </div>
  </section>
)

export default LoginFeaturesGrid
