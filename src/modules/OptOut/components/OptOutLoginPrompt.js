import React from 'react'
import desoLogo from 'assets/deso-logo.png'

const OptOutLoginPrompt = ({ onLogin }) => (
  <section aria-labelledby='optout-login-heading'>
    <p
      id='optout-login-heading'
      className='mx-auto mb-8 max-w-2xl text-balance text-base font-semibold leading-snug text-muted sm:mb-10 sm:text-lg'
    >
      You will need to sign into your DeSo account to opt out of receiving notifications via DeSoOps tagging.
    </p>
    <button type='button' className='login-cta-button' onClick={onLogin}>
      <img src={desoLogo} alt='' className='h-6 w-6 shrink-0' />
      Sign in with DeSo
    </button>
  </section>
)

export default OptOutLoginPrompt
