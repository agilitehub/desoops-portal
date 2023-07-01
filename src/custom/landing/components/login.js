import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { identity } from 'deso-protocol'
import { Col, Row, message, Spin, theme } from 'antd'
import { deviceDetect } from 'react-device-detect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import logo from '../../assets/deso-ops-logo-full-v2.png'
import { setDeSoData } from '../../reducer'
import { getDeSoData } from '../../deso/controller'

const Login = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken()

  const handleLogin = async () => {
    let loginResult = null
    let desoData = null

    try {
      loginResult = await identity.login()
      desoData = await getDeSoData(loginResult.publicKeyBase58Check)
      console.log('desoData', desoData)
      dispatch(setDeSoData(desoData))
    } catch (e) {
      setLoading(false)
      message.error(e)
    }
  }

  return (
    <Row justify='center' style={{ marginTop: -100 }}>
      <Col
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          borderRadius: deviceDetect().isMobile ? 12 : 30,
          background: 'rgba(255,255,255, 0.95',
          overflow: 'hidden'
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
        {!loading ? (
          <Row justify='center' style={{ marginBottom: 20 }}>
            <Col>
              <span>
                New to DeSo?
                <span style={{ cursor: 'pointer', color: token.colorPrimary, fontSize: 17 }}> Watch Introduction</span>
              </span>
            </Col>
          </Row>
        ) : null}

        <Row justify='space-around' gutter={[12, 12]}>
          <Col span={24}>
            <center>
              <button
                className='sign-register-button'
                disabled={loading}
                onClick={handleLogin}
                style={loading ? {} : { background: '#188EFF', width: 'auto' }}
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
                  <FontAwesomeIcon color='#FF7F50' icon={faCheckCircle} /> Payment Distributions
                </p>
                <p>
                  <FontAwesomeIcon color='#FF7F50' icon={faCheckCircle} /> Distribute to DAO Token, Creator Coin, and
                  NFT Holders
                </p>
                <p>
                  <FontAwesomeIcon color='#FF7F50' icon={faCheckCircle} /> Distribute $DESO, DAO Tokens, and Creator
                  Coins
                </p>
              </div>
            </div>
          </Col>
        </Row>
        {loading ? (
          <Row justify='center' style={{ marginTop: 20 }}>
            <Col>
              <Spin size='large' />
            </Col>
          </Row>
        ) : undefined}
      </Col>
    </Row>
  )
}

export default Login
