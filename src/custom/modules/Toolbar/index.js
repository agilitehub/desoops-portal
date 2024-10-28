import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Col, Layout, notification, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import Enums from '../../lib/enums'

import './style.sass'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faMoneyBillTransfer, faMessage, faBell } from '@fortawesome/free-solid-svg-icons'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '../../lib/firebase-controller'

const Toolbar = ({ state, setState }) => {
  const profile = useSelector((state) => state.custom.desoData.profile)
  const [api, contextHolder] = notification.useNotification()
  const [token, setToken] = React.useState('')

  const requestForPushNotifications = async () => {
    const permission = await Notification.requestPermission()

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      })

      //We can send token to server
      console.log('Token generated : ', token)
      setToken(token)
    } else if (permission === 'denied') {
      //notifications are blocked
      alert('You denied for the notification')
    }
  }

  useEffect(() => {
    console.log('Toolbar: useEffect', profile)
    if (profile?.publicKey) {
      const btn = (
        <Button type='primary' size='small' onClick={requestForPushNotifications}>
          Confirm
        </Button>
      )

      api.open({
        message: 'Token',
        description: token,
        duration: 0,
        btn,
        key: 'key'
      })
    }
  }, [profile, api, token])

  const handleNavigate = (renderState) => {
    setState({ renderState })
  }

  onMessage(messaging, (payload) => {
    console.log('incoming msg', payload)
  })

  return (
    <Layout className='toolbar-layout'>
      {contextHolder}
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
