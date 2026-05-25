import React from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message } from 'antd'

import styles from '../styles/login.module.sass'
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
    <Row className={styles.wrapper}>
      <Col span={24} className={styles.wrapperCol}>
        <LoginBackground />
        <div className={styles.pageContent}>
          <section className={styles.hero} aria-labelledby='login-welcome-heading'>
            <h1 id='login-welcome-heading' className={styles.welcomeTitle}>
              Welcome to <span className={styles.welcomeBrand}>DeSoOps</span>
            </h1>
            <p className={styles.welcomeSubtitle}>
              The ultimate decentralized admin portal for DeSo creators—manage your community and distribute tokens.
            </p>
            <div className={styles.ctaRow}>
              <button type='button' className={styles.ctaButton} onClick={handleLogin}>
                <img src={desoLogo} alt='' className={styles.ctaLogo} />
                Sign in with DeSo
              </button>
              <button type='button' className={styles.ctaButton} onClick={handleCreateAccount}>
                <img src={desoLogo} alt='' className={styles.ctaLogo} />
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
