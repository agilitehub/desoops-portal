import React, { useReducer } from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message, theme, Card, Button } from 'antd'
import { faCheckCircle, faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import styles from './style.module.sass'
import logo from '../../assets/deso-ops-logo-full.png'
import VideoModal from '../../reusables/components/VideoModal'
import Enums from '../../lib/enums'
import { useSelector } from 'react-redux'
import { getDeSoConfig } from '../../lib/deso-controller'
import HeroSwapModal from '../../reusables/components/HeroSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

const Login = () => {
  const [state, setState] = useReducer(reducer, {
    openVideoModal: false,
    openHeroSwapModal: false
  })

  const { token } = theme.useToken()
  const { isTablet, isSmartphone } = useSelector((state) => state.custom.userAgent)

  const handleLogin = async () => {
    try {
      // setState({ loading: true })
      await identity.login()
    } catch (e) {
      // setState({ loading: false })
      message.error(e)
    }
  }

  const handleWatchIntroduction = () => {
    setState({ openVideoModal: true })
  }

  const handleLaunchHeroSwap = () => {
    setState({ openHeroSwapModal: true })
  }

  const styleProps = {
    rowMarginTop: isTablet ? -100 : isSmartphone ? -20 : -100,
    contentBorderRadius: isSmartphone ? 12 : 30,
    bulletPointFontSize: isSmartphone ? 14 : 16,
    logoWidth: isSmartphone ? 200 : 300
  }

  return (
    <>
      <Row className={styles.wrapper}>
        <Col span={24}>
          <Row justify='center'>
            <Col span={24}>
              <Card type='inner' size='small' className={styles.card}>
                <Row justify='center' style={{ marginTop: styleProps.rowMarginTop }}>
                  <Col
                    className={styles.cardContent}
                    style={{
                      borderRadius: styleProps.contentBorderRadius
                    }}
                    xs={24}
                    sm={22}
                    md={16}
                    lg={14}
                    xl={12}
                    xxl={10}
                  >
                    <center>
                      <img src={logo} alt='DeSoOps Portal' style={{ width: styleProps.logoWidth }} />
                      <h1 style={{ marginTop: -20 }}> PORTAL SIGN-IN</h1>
                    </center>
                    {/* {!state.loading ? ( */}
                    <Row justify='center' style={{ marginBottom: 20 }}>
                      <Col>
                        <span>
                          New to DeSo?
                          <Button
                            type='link'
                            style={{ cursor: 'pointer', color: token.colorPrimary, fontSize: 17 }}
                            onClick={handleWatchIntroduction}
                          >
                            {' '}
                            Watch Introduction
                          </Button>
                        </span>
                      </Col>
                    </Row>
                    {/* // ) : null} */}

                    <Row justify='space-around' gutter={[12, 12]}>
                      <Col
                        span={24}
                        className={styles.btnWrapper}
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <button className={styles.signInButton} onClick={handleLogin}>
                          <div className={styles.icon}>
                            <LoginOutlined style={{ fontSize: 20 }} />
                          </div>
                          <span className={styles.text}>SIGN IN WITH DESO</span>
                        </button>
                        <button className={styles.coinSwapButton} onClick={handleLaunchHeroSwap}>
                          <div className={styles.icon}>
                            <FontAwesomeIcon style={{ fontSize: 20 }} icon={faBitcoinSign} />
                          </div>
                          <span className={styles.text}>COIN SWAP</span>
                        </button>
                      </Col>
                      <Col span={24}>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: 5, paddingRight: 5 }}>
                          <div>
                            <p style={{ marginTop: 0 }}>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} />{' '}
                              <span style={{ fontSize: styleProps.bulletPointFontSize }}>Payment Distributions</span>
                            </p>
                            <p style={{ marginTop: -10 }}>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} />{' '}
                              <span style={{ fontSize: styleProps.bulletPointFontSize }}>
                                Distribute to DAO Token, Creator Coin, and NFT Holders
                              </span>
                            </p>
                            <p style={{ marginTop: -10 }}>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} />{' '}
                              <span style={{ fontSize: styleProps.bulletPointFontSize }}>
                                Distribute $DESO, DAO Tokens, and Creator Coins
                              </span>
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <VideoModal
        isOpen={state.openVideoModal}
        title='DeSo Essentials'
        url={Enums.values.DESO_ESSENTIALS_PLAYLIST_URL}
        onCloseModal={() => setState({ openVideoModal: false })}
      />
      <HeroSwapModal isOpen={state.openHeroSwapModal} onCloseModal={() => setState({ openHeroSwapModal: false })} />
    </>
  )
}

export default Login
