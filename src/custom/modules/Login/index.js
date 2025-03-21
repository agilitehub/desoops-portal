import React, { useReducer, useState } from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message, Card, Button, Space, Tabs, Divider } from 'antd'
import { faCheckCircle, faBitcoinSign, faPlay, faGlobe, faUsers, faChartLine, faGem, faQuestionCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons'

// Utils
import styles from './style.module.sass'
import logo from '../../assets/deso-ops-logo-full.png'
import VideoModal from '../../reusables/components/VideoModal'
import Enums from '../../lib/enums'
import { useSelector } from 'react-redux'
import { getDeSoConfig } from '../../lib/deso-controller-graphql'
import CoinSwapModal from '../../reusables/components/CoinSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

const Login = () => {
  const [state, setState] = useReducer(reducer, {
    openVideoModal: false,
    videoUrl: '',
    videoModalTitle: '',
    openCoinSwapModal: false,
    activeTab: 'home'
  })
  const [showEmbeddedVideo, setShowEmbeddedVideo] = useState(false)

  const { isTablet, isSmartphone } = useSelector((state) => state.custom.userAgent)

  const handleLogin = async () => {
    try {
      await identity.login()
    } catch (e) {
      message.error(e)
    }
  }

  const handleWatchIntroductionDeSoOps = () => {
    const videoUrl = Enums.values.DESOOPS_VIDEO_URL
    const videoModalTitle = 'Introduction To DeSoOps'
    const openVideoModal = true

    setState({ openVideoModal, videoUrl, videoModalTitle })
  }

  const handleWatchIntroductionDeSo = () => {
    const videoUrl = Enums.values.DESO_VIDEO_URL
    const videoModalTitle = 'DeSo Essentials'
    const openVideoModal = true

    setState({ openVideoModal, videoUrl, videoModalTitle })
  }

  const handleLaunchCoinSwap = () => {
    setState({ openCoinSwapModal: true })
  }

  const toggleEmbeddedVideos = () => {
    setShowEmbeddedVideo(!showEmbeddedVideo)
  }

  const handleTabChange = (key) => {
    setState({ activeTab: key })
  }

  const styleProps = {
    rowMarginTop: isSmartphone ? 20 : 40,
    contentBorderRadius: isSmartphone ? 12 : 30,
    bulletPointFontSize: isSmartphone ? 14 : 16,
    logoWidth: isSmartphone ? 200 : 300
  }

  const renderTabContent = () => {
    switch(state.activeTab) {
      case 'home':
        return (
          <div className={styles.homeTabContent}>
            {/* Hero Section */}
            <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
              <Col span={24} className={styles.heroSection}>
                <div className={styles.logoContainer}>
                  <img src={logo} alt='DeSoOps Portal' />
                  <h1>Welcome to DeSoOps Portal</h1>
                  <p className={styles.heroParagraph}>Your comprehensive solution for DeSo operations and management</p>
                </div>
                <div className={styles.heroButtons}>
                  <Button type='primary' size='large' onClick={handleLogin} className={styles.signInButton}>
                    <Space>
                      <LoginOutlined style={{ fontSize: 20 }} />
                      SIGN IN WITH DESO
                    </Space>
                  </Button>
                  <Button className={styles.signUpButton} type='primary' size='large' onClick={handleLogin}>
                    <Space>
                      <UserAddOutlined style={{ fontSize: 20 }} />
                      SIGN UP WITH DESO
                    </Space>
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Benefits Bar */}
            <Row className={styles.benefitsBar}>
              <Col xs={24} sm={8}>
                <div className={styles.benefitItem}>
                  <FontAwesomeIcon icon={faGlobe} className={styles.benefitIcon} />
                  <span>Decentralized Social Platform</span>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles.benefitItem}>
                  <FontAwesomeIcon icon={faUsers} className={styles.benefitIcon} />
                  <span>Growing Community</span>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className={styles.benefitItem}>
                  <FontAwesomeIcon icon={faChartLine} className={styles.benefitIcon} />
                  <span>Creator Economy</span>
                </div>
              </Col>
            </Row>

            {/* Video Section */}
            <Row className={styles.videoSectionRow}>
              <Col span={24}>
                <div className={styles.sectionTitle}>
                  <h2>Learn More About DeSoOps</h2>
                  <p className={styles.sectionDescription}>Watch these videos to understand how DeSoOps can transform your DeSo experience</p>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.videosWrapper}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <div className={styles.videoContainer}>
                        <iframe 
                          width='100%' 
                          height={isSmartphone ? '200' : '350'} 
                          src='https://www.youtube.com/embed/PAQELCazfs8' 
                          title='Introduction To DeSoOps'
                          frameBorder='0' 
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
                          allowFullScreen
                        ></iframe>
                        <div className={styles.videoTitle}>Introduction To DeSoOps</div>
                      </div>
                    </Col>
                    <Col xs={24} md={12}>
                      <div className={styles.videoContainer}>
                        <iframe 
                          width='100%' 
                          height={isSmartphone ? '200' : '350'} 
                          src='https://www.youtube.com/embed/Qf2DMRo_Fyc' 
                          title='DeSo Essentials'
                          frameBorder='0' 
                          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
                          allowFullScreen
                        ></iframe>
                        <div className={styles.videoTitle}>DeSo Essentials</div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Features Section */}
            <Row gutter={[24, 24]} className={styles.featuresRow}>
              <Col span={24}>
                <div className={styles.sectionTitle}>
                  <h2>Powerful Features</h2>
                  <p className={styles.sectionDescription}>Everything you need to manage your DeSo operations</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faCheckCircle} />
                  </div>
                  <h3>Bulk Token Distributions</h3>
                  <p>Easily distribute tokens to multiple DeSo wallets in a single transaction</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faCheckCircle} />
                  </div>
                  <h3>Target Distribution Groups</h3>
                  <p>Distribute to Social/Creator/NFT Holders, and more</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faCheckCircle} />
                  </div>
                  <h3>Multiple Asset Types</h3>
                  <p>Distribute $DESO, Tokens, Creator Coins & Crypto</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faGem} />
                  </div>
                  <h3>Push Notifications</h3>
                  <p>Get instant alerts when receiving crypto in your wallet</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faBitcoinSign} />
                  </div>
                  <h3>Coin Swap</h3>
                  <p>Easily exchange between different cryptocurrencies</p>
                </div>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <FontAwesomeIcon className={styles.featureIconShape} icon={faUsers} />
                  </div>
                  <h3>Community Tools</h3>
                  <p>Engage with your community through powerful distribution tools</p>
                </div>
              </Col>
            </Row>

            {/* CTA Section */}
            <Row gutter={[16, 16]} className={styles.ctaSection}>
              <Col xs={24} md={12}>
                <div className={styles.ctaContent}>
                  <h2>Ready to get started?</h2>
                  <p>Sign in with your DeSo account to access all features</p>
                  <div className={styles.ctaButtons}>
                    <Button type='primary' size='large' onClick={handleLogin} className={styles.signInButton}>
                      <Space>
                        <LoginOutlined style={{ fontSize: 20 }} />
                        SIGN IN WITH DESO
                      </Space>
                    </Button>
                    <Button className={styles.signUpButton} type='primary' size='large' onClick={handleLogin}>
                      <Space>
                        <UserAddOutlined style={{ fontSize: 20 }} />
                        SIGN UP WITH DESO
                      </Space>
                    </Button>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div className={styles.ctaImage}>
                  <div className={styles.notificationPreview}>
                    <div className={styles.notificationHeader}>
                      <FontAwesomeIcon icon={faBitcoinSign} /> 
                      <span>DeSoOps Notification</span>
                    </div>
                    <div className={styles.notificationContent}>
                      <p>You've received 50 $DESO from Bulk Distribution!</p>
                      <div className={styles.notificationTime}>Just now</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Testimonials Section */}
            <Row className={styles.testimonialsRow}>
              <Col span={24}>
                <div className={styles.sectionTitle}>
                  <h2>What Our Users Say</h2>
                  <p className={styles.sectionDescription}>Hear from people who are using DeSoOps</p>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.testimonialCards}>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                      <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                          <p>"DeSoOps has transformed how I manage token distributions to my community. The bulk distribution feature saves me hours every week."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                          <h4>Sarah Johnson</h4>
                          <p>Content Creator</p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={8}>
                      <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                          <p>"The ability to target specific holder groups has dramatically improved our community engagement and token utility."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                          <h4>David Chen</h4>
                          <p>DAO Organizer</p>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={8}>
                      <div className={styles.testimonialCard}>
                        <div className={styles.testimonialContent}>
                          <p>"Push notifications for crypto transfers have been a game-changer for our community rewards program. Our members love the instant alerts."</p>
                        </div>
                        <div className={styles.testimonialAuthor}>
                          <h4>Michael Rodriguez</h4>
                          <p>Community Manager</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* FAQ Section */}
            <Row className={styles.faqRow}>
              <Col span={24}>
                <div className={styles.sectionTitle}>
                  <h2>Frequently Asked Questions</h2>
                  <p className={styles.sectionDescription}>Get answers to common questions about DeSoOps</p>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.faqContainer}>
                  <div className={styles.faqItem}>
                    <div className={styles.faqQuestion}>
                      <FontAwesomeIcon icon={faQuestionCircle} className={styles.faqIcon} />
                      <h3>What is DeSoOps?</h3>
                    </div>
                    <div className={styles.faqAnswer}>
                      <p>DeSoOps is a comprehensive management portal for DeSo operations, allowing users to distribute tokens, manage communities, and streamline crypto operations on the DeSo blockchain.</p>
                    </div>
                  </div>
                  <div className={styles.faqItem}>
                    <div className={styles.faqQuestion}>
                      <FontAwesomeIcon icon={faQuestionCircle} className={styles.faqIcon} />
                      <h3>Do I need a DeSo account to use DeSoOps?</h3>
                    </div>
                    <div className={styles.faqAnswer}>
                      <p>Yes, you'll need a DeSo account to access the features of DeSoOps. If you don't have one yet, you can sign up directly through our platform.</p>
                    </div>
                  </div>
                  <div className={styles.faqItem}>
                    <div className={styles.faqQuestion}>
                      <FontAwesomeIcon icon={faQuestionCircle} className={styles.faqIcon} />
                      <h3>How do bulk token distributions work?</h3>
                    </div>
                    <div className={styles.faqAnswer}>
                      <p>Our bulk distribution system allows you to send tokens to multiple wallet addresses in a single transaction, saving time and reducing transaction costs. You can target specific user groups like followers, NFT holders, or custom lists.</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Contact Section */}
            <Row className={styles.contactRow}>
              <Col span={24}>
                <div className={styles.contactContainer}>
                  <div className={styles.contactContent}>
                    <h2>Need Help?</h2>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <Button type='primary' size='large' className={styles.contactButton}>
                      <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8 }} /> Contact Support
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Footer */}
            <Row className={styles.footerRow}>
              <Col span={24}>
                <div className={styles.footer}>
                  <div className={styles.footerLogo}>
                    <img src={logo} alt='DeSoOps Portal' />
                  </div>
                  <div className={styles.footerLinks}>
                    <a href='#'>Terms of Service</a>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>About</a>
                    <a href='#'>Contact</a>
                  </div>
                  <div className={styles.footerCopyright}>
                    <p>© {new Date().getFullYear()} DeSoOps. All rights reserved.</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )
      case 'coin-swap':
        return (
          <div className={styles.coinSwapTabContent}>
            <div className={styles.coinSwapTab}>
              <CoinSwapModal embedded={true} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.bgEffect1}></div>
        <div className={styles.bgEffect2}></div>
        <div className={styles.bgEffect3}></div>
        <div className={styles.bgEffect4}></div>
        <div className={styles.bgExtra1}></div>
        <div className={styles.bgExtra2}></div>
        <div className={styles.lightRay}></div>
        <div className={styles.diagonalLightRay1}></div>
        <div className={styles.diagonalLightRay2}></div>
        <div className={styles['wave-container']}>
          <div className={`${styles.wave} ${styles.wave1}`}></div>
          <div className={`${styles.wave} ${styles.wave2}`}></div>
          <div className={`${styles.wave} ${styles.wave3}`}></div>
          <div className={`${styles.wave} ${styles.wave4}`}></div>
          <div className={`${styles.wave} ${styles.wave5}`}></div>
          <div className={`${styles.wave} ${styles.wave6}`}></div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.navLogo}>
            <img src={logo} alt='DeSoOps Portal' />
          </div>
          <div className={styles.navLinks}>
            <Button 
              type={state.activeTab === 'home' ? 'primary' : 'text'} 
              onClick={() => handleTabChange('home')}
            >
              Home
            </Button>
            <Button 
              type={state.activeTab === 'coin-swap' ? 'primary' : 'text'} 
              onClick={() => handleTabChange('coin-swap')}
            >
              <FontAwesomeIcon icon={faBitcoinSign} /> Coin Swap
            </Button>
            <Button 
              type='primary' 
              ghost 
              onClick={handleLogin}
            >
              <LoginOutlined /> Sign In
            </Button>
            <Button 
              type='primary' 
              onClick={handleLogin}
            >
              <UserAddOutlined /> Sign Up
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          {renderTabContent()}
        </div>
      </div>

      <VideoModal
        isOpen={state.openVideoModal}
        title={state.videoModalTitle}
        url={state.videoUrl}
        onCloseModal={() => setState({ openVideoModal: false })}
      />
    </>
  )
}

export default Login
