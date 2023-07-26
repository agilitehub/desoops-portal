import React, { useReducer } from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message, theme, Card, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import styles from './style.module.sass'
import logo from '../../assets/deso-ops-logo-full-v2.png'
import VideoModal from '../../reusables/components/VideoModal'
import Enums from '../../lib/enums'
import { useSelector } from 'react-redux'

configure({
  appName: process.env.REACT_APP_NAME,
  spendingLimitOptions: {
    // IsUnlimited: true
    GlobalDESOLimit: 100 * 1e9, // 100 Deso
    CreatorCoinOperationLimitMap: {
      '': {
        any: 'UNLIMITED'
      }
    },
    DAOCoinOperationLimitMap: {
      '': {
        transfer: 'UNLIMITED'
      }
    },
    TransactionCountLimitMap: {
      BASIC_TRANSFER: 'UNLIMITED',
      DAO_COIN: 'UNLIMITED',
      DAO_COIN_TRANSFER: 'UNLIMITED',
      CREATOR_COIN: 'UNLIMITED',
      CREATOR_COIN_TRANSFER: 'UNLIMITED'
    }
  }
})

const reducer = (state, newState) => ({ ...state, ...newState })

const Login = () => {
  const [state, setState] = useReducer(reducer, {
    openVideoModal: false
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
                      <img src={logo} alt='DeSo Ops Portal' style={{ width: styleProps.logoWidth }} />
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
                      <Col span={24}>
                        <center>
                          <button
                            className={styles.signInButton}
                            // disabled={state.loading}
                            onClick={handleLogin}
                            // style={state.loading ? { background: '#cccccc52' } : { background: '#188EFF' }}
                            style={{ background: '#188EFF' }}
                          >
                            <div>
                              <LoginOutlined style={{ fontSize: 20 }} />
                            </div>
                            <span>SIGN IN WITH DESO</span>
                          </button>
                        </center>
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
                    {/* {state.loading ? (
                      <Row justify='center' style={{ marginTop: 20 }}>
                        <Col>
                          <Spin size='large' />
                        </Col>
                      </Row>
                    ) : undefined} */}
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
    </>
  )
}

export default Login
