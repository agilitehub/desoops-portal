import React, { useEffect, useReducer } from 'react'
import { Col, Row, message, Card, Button } from 'antd'
import { faCheckCircle, faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'

// Utils
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './style.sass'
import { head } from 'lodash'

const reducer = (state, newState) => ({ ...state, ...newState })

const Completion = ({ rootState }) => {
  const { isTablet, isSmartphone } = useSelector((state) => state.custom.userAgent)

  const [state, setState] = useReducer(reducer, {
    headerMessage: '',
    headerClass: ''
  })

  useEffect(() => {
    const init = async () => {
      try {
        let headerMessage = null
        let headerClass = null

        switch (rootState.optOutStatus) {
          case 'SUCCESS':
            headerClass = 'header-success'
            headerMessage = `You have successfully Opted-Out of DeSoOps Notifications from user - @${rootState.username}`
            break
          case 'CONFLICT':
            headerClass = 'header-conflict'
            headerMessage = `You have already Opted-Out of DeSoOps Notifications from user - @${rootState.username}`
            break
          case 'NO_PUBLIC_KEY':
            headerClass = 'header-error'
            headerMessage = 'No Public Key was provided in the URL. Please review and try again.'
            break
          case 'PUBLIC_KEY_NOT_FOUND':
            headerClass = 'header-error'
            headerMessage =
              'The Public Key provided in the URL does not match any existing DeSo Profiles. Please review and try again.'
            break
        }

        setState({ headerMessage, headerClass })
      } catch (e) {
        console.error(e)
      }
    }

    init()
  }, [])

  const styleProps = {
    rowMarginTop: isTablet ? -100 : isSmartphone ? -20 : -100,
    contentBorderRadius: isSmartphone ? 12 : 30,
    bulletPointFontSize: isSmartphone ? 14 : 16,
    logoWidth: isSmartphone ? 200 : 300
  }

  return (
    <>
      <Row className='wrapper'>
        <Col span={24}>
          <Row justify='center'>
            <Col span={24}>
              <Card type='inner' size='small' className='card'>
                <Row justify='center' style={{ marginTop: styleProps.rowMarginTop }}>
                  <Col
                    className='card-content'
                    style={{
                      borderRadius: styleProps.contentBorderRadius
                    }}
                    span={24}
                  >
                    <center>
                      <span className={state.headerClass}>{state.headerMessage}</span>
                    </center>
                    <Row justify='space-around' gutter={[12, 12]}>
                      <Col span={24} className='btn-wrapper' style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btn-signin'>
                          <div className='icon'>
                            <LoginOutlined style={{ fontSize: 20 }} />
                          </div>
                          <span className='text'>SIGN IN WITH DESO</span>
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Completion
