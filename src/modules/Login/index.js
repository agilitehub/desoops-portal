import React, { useReducer } from 'react'
import { configure } from 'deso-protocol'
import { Col, Row, Card, Button } from 'antd'
import { faCheckCircle, faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import logo from 'assets/deso-ops-logo-full.png'
import { getDeSoConfig } from 'lib/deso-controller'
import Enums from 'lib/enums'
import VideoModal from 'reusables/components/VideoModal'
import HeroSwapModal from 'reusables/components/HeroSwapModal'

import './style.sass'
import { desoLogin } from 'lib/deso-controller-graphql'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

const Login = () => {
  const [state, setState] = useReducer(reducer, {
    openVideoModal: false,
    openHeroSwapModal: false
  })

  const handleWatchIntroduction = () => {
    setState({ openVideoModal: true })
  }

  const handleLaunchHeroSwap = () => {
    setState({ openHeroSwapModal: true })
  }

  return (
    <>
      <Row className='login-wrapper'>
        <Col span={24}>
          <Row justify='center'>
            <Col span={24}>
              <Card type='inner' size='small' className='login-card'>
                <Row justify='center' className='row'>
                  <Col className='login-card-content' xs={24} sm={22} md={16} lg={14} xl={12} xxl={10}>
                    <center>
                      <img src={logo} alt={process.env.REACT_APP_NAME} className='login-logo' />
                      <h1 style={{ marginTop: -20 }}> PORTAL SIGN-IN</h1>
                    </center>
                    <Row justify='center' style={{ marginBottom: 20 }}>
                      <Col>
                        <span>
                          New to DeSo?
                          <Button type='link' className='deso-btn-link' onClick={handleWatchIntroduction}>
                            {' '}
                            Watch Introduction
                          </Button>
                        </span>
                      </Col>
                    </Row>

                    <Row justify='space-around' gutter={[12, 12]}>
                      <Col span={24} className='login-btn-wrapper'>
                        <button className='sign-in-btn' onClick={desoLogin}>
                          <div className='icon'>
                            <LoginOutlined style={{ fontSize: 20 }} />
                          </div>
                          <span className='text'>SIGN IN WITH DESO</span>
                        </button>
                        <button className='coin-swap-btn' onClick={handleLaunchHeroSwap}>
                          <div className='icon'>
                            <FontAwesomeIcon style={{ fontSize: 20 }} icon={faBitcoinSign} />
                          </div>
                          <span className='text'>COIN SWAP</span>
                        </button>
                      </Col>
                      <Col span={24}>
                        <div className='check-wrapper'>
                          <div>
                            <p style={{ marginTop: 0 }}>
                              <FontAwesomeIcon className='check-color' icon={faCheckCircle} />{' '}
                              <span className='check-label'>Payment Distributions</span>
                            </p>
                            <p style={{ marginTop: -10 }}>
                              <FontAwesomeIcon className='check-color' icon={faCheckCircle} />{' '}
                              <span className='check-label'>
                                Distribute to DAO Token, Creator Coin, and NFT Holders
                              </span>
                            </p>
                            <p style={{ marginTop: -10 }}>
                              <FontAwesomeIcon className='check-color' icon={faCheckCircle} />{' '}
                              <span className='check-label'>Distribute $DESO, DAO Tokens, and Creator Coins</span>
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
