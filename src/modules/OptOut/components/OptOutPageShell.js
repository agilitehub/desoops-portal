import React from 'react'
import logo from 'assets/deso-ops-logo-full-dark.png'

const OptOutPageShell = ({ children, title }) => (
  <div className='relative min-h-[calc(100vh-4rem)] w-full min-w-0 max-sm:min-h-[calc(100vh-3.25rem)]'>
    <div className='dashboard-bg' aria-hidden='true'>
      <div className='dashboard-shape dashboard-shape-coral' />
      <div className='dashboard-shape dashboard-shape-blue' />
    </div>

    <div className='relative z-[1] mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8 max-sm:min-h-[calc(100vh-3.25rem)]'>
      <img
        src={logo}
        alt={process.env.REACT_APP_NAME || 'DeSoOps'}
        className='mx-auto mb-8 block w-[clamp(220px,30vw,360px)] max-w-[85vw] object-contain sm:mb-10'
      />

      {title ? (
        <h1 className='mb-8 text-[clamp(1.5rem,4vw,2rem)] font-extrabold leading-tight tracking-tight sm:mb-10'>
          {title}
        </h1>
      ) : null}

      <div className='w-full'>{children}</div>
    </div>
  </div>
)

export default OptOutPageShell
