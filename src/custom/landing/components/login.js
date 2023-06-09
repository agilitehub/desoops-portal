import React, { useEffect, useState } from 'react'
import { Col, Row, message, Spin, theme } from 'antd'
import logo from '../../assets/deso-ops-logo-transparent.png'

// Utils
import Enums from '../../../utils/enums'

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { MailOutlined } from '@ant-design/icons'
import { deviceDetect } from 'react-device-detect'

const Login = () => {
  const [facet, setFacet] = useState('options')
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [facet])

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      // Login
      setLoading(false)
    } catch (e) {
      setLoading(false)
      message.error(e)
    }
  }

  return (
    <Row justify='center' style={{ marginTop: 10 }}>
      <Col
        style={{
          paddingTop: 50,
          paddingBottom: 50,
          borderRadius: deviceDetect().isMobile ? 12 : 30,
          background: 'rgba(255,255,255, 0.95',
          overflow: 'hidden'
        }}
        xs={24}
        sm={20}
        md={18}
        lg={10}
      >
        {facet === Enums.facets.OPTIONS ? (
          <>
            <center>
              <img src={logo} alt='DeSo Ops Portal' style={{ width: 100 }} />
              <h1>DESO OPS PORTAL</h1>
              <h2 style={{ marginBottom: 0 }}> SIGN-IN</h2>
            </center>
            {!loading ? (
              <Row justify='center' style={{ marginBottom: 20 }}>
                <Col>
                  <span onClick={() => {}}>
                    Don't have an account yet?
                    <span style={{ cursor: 'pointer', color: token.colorPrimary, fontSize: 17 }}> Register here</span>
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
                    style={loading ? {} : { background: token.colorSecondary }}
                  >
                    <div>
                      <MailOutlined style={{ fontSize: 20 }} />
                    </div>
                    <span>SIGN IN WITH DESO</span>
                  </button>
                </center>
              </Col>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div>
                    <p>
                      <FontAwesomeIcon color={token.colorSuccess} icon={faCheckCircle} /> In-Clinic Services
                    </p>
                    <p>
                      <FontAwesomeIcon color={token.colorSuccess} icon={faCheckCircle} /> Home Visits
                    </p>
                    <p>
                      <FontAwesomeIcon color={token.colorSuccess} icon={faCheckCircle} /> Virtual/Tele Consultations
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : undefined}
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
