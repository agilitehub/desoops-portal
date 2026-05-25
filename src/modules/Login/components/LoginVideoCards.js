import React from 'react'

import styles from '../styles/login.module.sass'

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
  <div className={styles.videoGrid}>
    {LOGIN_VIDEOS.map((video) => (
      <article key={video.embedId} className={styles.videoCard}>
        <h2 className={styles.videoHeading}>{video.heading}</h2>
        <div className={styles.videoEmbed}>
          <iframe
            className={styles.videoIframe}
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
