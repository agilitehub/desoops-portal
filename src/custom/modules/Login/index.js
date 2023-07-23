import React, { useReducer, useState } from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message, Spin, theme, Card, Button } from 'antd'
import { deviceDetect } from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import styles from './style.module.sass'
import logo from '../../assets/deso-ops-logo-full-v2.png'
import VideoModal from '../../reusables/components/VideoModal'
import Enums from '../../lib/enums'

configure({
  appName: process.env.REACT_APP_NAME,
  spendingLimitOptions: {
    // IsUnlimited: true,
    GlobalDESOLimit: 1 * 1e9, // 1 Deso
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
    loading: false,
    openVideoModal: false
  })

  const { token } = theme.useToken()

  const handleLogin = async () => {
    try {
      setState({ loading: true })
      await identity.login()
    } catch (e) {
      setState({ loading: false })
      message.error(e)
    }
  }

  const handleWatchIntroduction = () => {
    setState({ openVideoModal: true })
  }

  return (
    <>
      <Row className={styles.wrapper}>
        <Col span={24}>
          <Row justify='center'>
            <Col span={24}>
              <Card type='inner' size='small' className={styles.card}>
                <Row justify='center' style={{ marginTop: -100 }}>
                  <Col
                    className={styles.cardContent}
                    style={{
                      borderRadius: deviceDetect().isMobile ? 12 : 30
                    }}
                    xs={24}
                    sm={20}
                    md={18}
                    lg={10}
                  >
                    <center>
                      <img src={logo} alt='DeSo Ops Portal' style={{ width: 300 }} />
                      <h1 style={{ marginTop: -20 }}> PORTAL SIGN-IN</h1>
                    </center>
                    {!state.loading ? (
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
                    ) : null}

                    <Row justify='space-around' gutter={[12, 12]}>
                      <Col span={24}>
                        <center>
                          <button
                            className={styles.signInButton}
                            disabled={state.loading}
                            onClick={handleLogin}
                            style={state.loading ? { background: '#cccccc52' } : { background: '#188EFF' }}
                          >
                            <div>
                              <LoginOutlined style={{ fontSize: 20 }} />
                            </div>
                            <span>SIGN IN WITH DESO</span>
                          </button>
                        </center>
                      </Col>
                      <Col span={24}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <div>
                            <p>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} /> Payment
                              Distributions
                            </p>
                            <p>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} /> Distribute to DAO
                              Token, Creator Coin, and NFT Holders
                            </p>
                            <p>
                              <FontAwesomeIcon className={styles.checkColor} icon={faCheckCircle} /> Distribute $DESO,
                              DAO Tokens, and Creator Coins
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    {state.loading ? (
                      <Row justify='center' style={{ marginTop: 20 }}>
                        <Col>
                          <Spin size='large' />
                        </Col>
                      </Row>
                    ) : undefined}
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
