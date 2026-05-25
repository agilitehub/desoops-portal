import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faWallet, faKey, faRocket, faHeadset } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/login.module.sass'

const REVIEWS = [
  {
    icon: faWallet,
    name: 'Sarah K. | NFT Artist',
    badge: 'Verified Creator',
    quote:
      'DeSoOps transformed how I manage my NFT drops. The automated distribution tools saved me countless hours, and my community engagement has never been better!',
    reviewUrl: 'https://g.co/kgs/sarah-k-review'
  },
  {
    icon: faKey,
    name: 'Alex M. | DAO Founder',
    badge: 'Top Contributor',
    quote:
      'Running our DAO became 10x easier with DeSoOps. The analytics tools give us incredible insights, and token distribution is now seamless!',
    reviewUrl: 'https://g.co/kgs/alex-m-review'
  },
  {
    icon: faRocket,
    name: 'Mike R. | Content Creator',
    badge: 'Diamond Holder',
    quote:
      "The community management features are game-changing. I can now reward my most loyal supporters automatically. It's like having a full-time community manager!",
    reviewUrl: 'https://g.co/kgs/mike-r-review'
  },
  {
    icon: faHeadset,
    name: 'Lisa T. | Tech Founder',
    badge: 'Early Adopter',
    quote:
      'The developer tools are robust and well-documented. We built our entire token strategy on DeSoOps, and the results have been phenomenal!',
    reviewUrl: 'https://g.co/kgs/lisa-t-review'
  }
]

const LoginReviewsGrid = () => (
  <section className={styles.reviewsSection} aria-labelledby='login-reviews-heading'>
    <h2 id='login-reviews-heading' className={styles.reviewsTitle}>
      What Our Users Say
    </h2>
    <div className={styles.reviewsGrid}>
      {REVIEWS.map((review) => (
        <article key={review.name} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewIconWrap}>
              <FontAwesomeIcon icon={review.icon} />
            </div>
            <div>
              <h3 className={styles.reviewName}>{review.name}</h3>
              <p className={styles.reviewBadge}>{review.badge}</p>
            </div>
          </div>
          <p className={styles.reviewQuote}>&ldquo;{review.quote}&rdquo;</p>
          <a
            className={styles.reviewLink}
            href={review.reviewUrl}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={faGoogle} />
            <span>View review on Google</span>
          </a>
        </article>
      ))}
    </div>
  </section>
)

export default LoginReviewsGrid
