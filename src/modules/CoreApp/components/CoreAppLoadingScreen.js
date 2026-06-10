import React from 'react'
import { Spin } from 'antd'
import logo from 'assets/deso-ops-logo-full-dark.png'

const CoreAppLoadingScreen = ({ message }) => (
  <div className='relative min-h-[calc(100vh-4rem)] w-full min-w-0 max-sm:min-h-[calc(100vh-3.25rem)]'>
    <div className='dashboard-bg' aria-hidden='true'>
      <div className='dashboard-shape dashboard-shape-coral' />
      <div className='dashboard-shape dashboard-shape-blue' />
    </div>

    <div className='relative z-[1] flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 max-sm:min-h-[calc(100vh-3.25rem)]'>
      <section
        className='w-full max-w-3xl text-center'
        aria-live='polite'
        aria-busy='true'
        aria-label={message}
      >
        <img
          src={logo}
          alt={process.env.REACT_APP_NAME || 'DeSoOps'}
          className='mx-auto mb-10 block w-[clamp(220px,30vw,360px)] max-w-[85vw] object-contain sm:mb-12'
        />

        <p className='mx-auto mb-12 max-w-2xl text-balance text-lg font-bold leading-snug text-foreground sm:mb-14 sm:text-xl'>
          {message}
        </p>

        <Spin size='large' className='app-loading-spin [&_.ant-spin-dot]:scale-150' />
      </section>
    </div>
  </div>
)

export default CoreAppLoadingScreen
