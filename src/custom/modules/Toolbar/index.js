import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Col, Layout, message, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import Enums from '../../lib/enums'

import './style.sass'
import { getToken, messaging, onMessage } from '../../../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faMoneyBillTransfer, faMessage, faBell } from '@fortawesome/free-solid-svg-icons'

const Toolbar = ({ state, setState }) => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  const requestPermission = async () => {
    try {
      const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
      if (currentToken) {
        console.log('FCM Token:', currentToken)
        // Send the token to your server to store for later use
      } else {
        console.log('No registration token available. Request permission to generate one.')
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      message.info('Message received')
      console.log('Message received. ', payload)
      // Customize how you display the notification or update your UI here
    })

    return () => unsubscribe()
  }, [])

  const handleNavigate = (renderState) => {
    setState({ renderState })
  }

  return (
    <Layout className='toolbar-layout'>
      <Header className='toolbar-header'>
        <Logo />

        {profile?.publicKey ? <ToolbarDropDown /> : null}
      </Header>
      <Footer className='toolbar-footer'>
        <Row justify='center' gutter={[24, 12]} style={{ marginTop: 20 }}>
          <Col>
            <FontAwesomeIcon icon={faHome} className='toolbar-footer-icon' />
          </Col>
          <Col>
            <FontAwesomeIcon
              className={
                state.renderState === Enums.appRenderState.DISTRO ? 'toolbar-footer-icon-active' : 'toolbar-footer-icon'
              }
              icon={faMoneyBillTransfer}
              onClick={() => handleNavigate(Enums.appRenderState.DISTRO)}
            />
          </Col>
          <Col>
            <FontAwesomeIcon className='toolbar-footer-icon' icon={faMessage} />
          </Col>
          <Col>
            <FontAwesomeIcon
              className={
                state.renderState === Enums.appRenderState.NOTIFICATIONS
                  ? 'toolbar-footer-icon-active'
                  : 'toolbar-footer-icon'
              }
              icon={faBell}
              onClick={() => handleNavigate(Enums.appRenderState.NOTIFICATIONS)}
            />
          </Col>
        </Row>
      </Footer>
    </Layout>
  )
}

export default Toolbar
