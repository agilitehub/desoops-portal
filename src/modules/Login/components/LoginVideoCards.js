import React from 'react'

const LOGIN_VIDEOS = [
  {
    heading: '🚀 Revolutionize Your DeSo Experience',
    embedId: 'PAQELCazfs8',
    iframeTitle: 'DeSoOps Introduction'
  },
  {
    heading: '⚡ Supercharge Your DeSo Journey',
    embedId: 'Qf2DMRo_Fyc',
    iframeTitle: 'DeSo Essentials'
  }
]

const LoginVideoCards = () => (
  <div className='mx-auto mt-7 grid w-full grid-cols-1 gap-5 text-center max-sm:gap-5 sm:grid-cols-2 lg:gap-6'>
    {LOGIN_VIDEOS.map((video) => (
      <article key={video.embedId} className='flex min-w-0 flex-col items-stretch [container-type:inline-size]'>
        <h2 className='mb-6 text-balance text-[clamp(0.9375rem,5.25cqi,1.125rem)] font-bold leading-snug tracking-tight text-foreground'>
          {video.heading}
        </h2>
        <div className='relative h-0 w-full overflow-hidden rounded-xl border border-border bg-surface pb-[56.25%] shadow-[0_8px_24px_rgba(28,75,115,0.12)] transition-[transform,box-shadow] duration-200 hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(28,75,115,0.16)]'>
          <iframe
            className='absolute left-0 top-0 h-full w-full border-0'
            src={`https://www.youtube-nocookie.com/embed/${video.embedId}?modestbranding=1&rel=0`}
            title={video.iframeTitle}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </article>
    ))}
  </div>
)

export default LoginVideoCards
