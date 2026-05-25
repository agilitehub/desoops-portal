import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faUsers,
  faServer,
  faChartLine,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/login.module.sass'

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
  <section className={styles.featuresSection} aria-labelledby='login-features-heading'>
    <h2 id='login-features-heading' className={styles.featuresTitle}>
      Powerful Features for DeSo Creators
    </h2>
    <div className={styles.featuresGrid}>
      {FEATURES.map((feature) => (
        <article key={feature.title} className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <FontAwesomeIcon icon={feature.icon} />
          </div>
          <h3 className={styles.featureCardTitle}>{feature.title}</h3>
          <p className={styles.featureCardDesc}>{feature.description}</p>
        </article>
      ))}
    </div>
  </section>
)

export default LoginFeaturesGrid
