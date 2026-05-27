import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faWallet, faKey, faRocket, faHeadset } from '@fortawesome/free-solid-svg-icons'

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
  <section className='mx-auto mt-12 w-full' aria-labelledby='login-reviews-heading'>
    <h2 id='login-reviews-heading' className='mb-10 text-center text-[clamp(1.125rem,2.2vw,1.5rem)] font-bold leading-tight text-deso-blue-deep'>
      What Our Users Say
    </h2>
    <div className='mx-auto grid w-full grid-cols-1 gap-[18px] lg:grid-cols-2 lg:gap-8'>
      {REVIEWS.map((review) => (
        <article
          key={review.name}
          className='rounded-xl border border-deso-orange/40 bg-gradient-to-br from-white/55 to-white/[0.32] p-6 shadow-[0_4px_12px_rgba(255,127,80,0.1),0_0_8px_rgba(24,142,255,0.08)] transition-[box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(28,75,115,0.12)]'
        >
          <div className='mb-3 flex items-start gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-deso-orange to-[#e86a3a] text-lg text-white'>
              <FontAwesomeIcon icon={review.icon} />
            </div>
            <div>
              <h3 className='m-0 text-base font-bold leading-snug text-foreground'>{review.name}</h3>
              <p className='mt-0.5 text-[0.8125rem] font-semibold text-deso-orange'>{review.badge}</p>
            </div>
          </div>
          <p className='mb-3 text-sm font-medium italic leading-[1.45] text-foreground/85'>&ldquo;{review.quote}&rdquo;</p>
          <a
            className='inline-flex items-center gap-1.5 text-xs font-semibold text-deso-blue underline hover:text-[#1478d9]'
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
