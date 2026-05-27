import React from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message } from 'antd'

import desoLogo from 'assets/deso-logo.png'
import LoginVideoCards from './LoginVideoCards'
import LoginFeaturesGrid from './LoginFeaturesGrid'
import LoginReviewsGrid from './LoginReviewsGrid'
import LoginBackground from './LoginBackground'
import { getDeSoConfig } from 'core/infra/deso-controller-graphql'

configure(getDeSoConfig())

const Login = () => {
  const handleLogin = async () => {
    try {
      await identity.login()
    } catch (e) {
      message.error(e)
    }
  }

  const handleCreateAccount = async () => {
    try {
      await identity.login({ getFreeDeso: true })
    } catch (e) {
      message.error(e)
    }
  }

  return (
    <Row className='relative min-h-screen w-full min-w-0 items-start justify-center overflow-x-clip'>
      <Col span={24} className='relative w-full min-w-0 max-w-full'>
        <LoginBackground />
        <div className='relative z-[1] mx-auto box-border w-full min-w-0 max-w-[80rem] px-4 pb-16 pt-6 max-sm:pb-24 sm:px-6 lg:px-8'>
          <section className='relative z-[1] min-w-0 px-4 pb-2 pt-6 text-center' aria-labelledby='login-welcome-heading'>
            <h1
              id='login-welcome-heading'
              className='mb-4 border-0 text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-tight tracking-tight text-deso-blue-deep shadow-none'
            >
              Welcome to{' '}
              <span className='text-[length:inherit] text-deso-orange'>DeSoOps</span>
            </h1>
            <p className='mx-auto mb-7 w-full max-w-none px-2 text-balance text-[1.0625rem] font-bold leading-snug text-foreground max-md:text-lg max-sm:text-[1.0625rem] max-sm:leading-[1.45]'>
              The ultimate decentralized admin portal for DeSo creators—manage your community and distribute tokens.
            </p>
            <div className='mb-0 flex flex-wrap justify-center gap-3'>
              <button type='button' className='login-cta-button' onClick={handleLogin}>
                <img src={desoLogo} alt='' className='h-6 w-6 shrink-0' />
                Sign in with DeSo
              </button>
              <button type='button' className='login-cta-button' onClick={handleCreateAccount}>
                <img src={desoLogo} alt='' className='h-6 w-6 shrink-0' />
                Create DeSo Account
              </button>
            </div>
            <LoginVideoCards />
            <LoginFeaturesGrid />
            <LoginReviewsGrid />
          </section>
        </div>
      </Col>
    </Row>
  )
}

export default Login
