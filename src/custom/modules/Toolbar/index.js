import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Col, Layout, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import Enums from '../../lib/enums'

import './style.sass'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faMessage, faBell, faWallet } from '@fortawesome/free-solid-svg-icons'
import { setComingSoonVisible } from '../../../custom/reducer'

const Toolbar = ({ state, setState, onNotificationsClick }) => {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const unreadCount = useSelector((state) => state.custom.unreadNotifications)

  const handleNavigate = (renderState) => {
    setState({ renderState })
  }

  useEffect(() => {
    if (state.renderState === Enums.appRenderState.LAUNCH) {
      setState({ renderState: Enums.appRenderState.DISTRO })
    }

    // eslint-disable-next-line
  }, [state.renderState])

  const showComingSoon = () => {
    dispatch(setComingSoonVisible(true))
  }

  return (
    <Layout className='toolbar-layout'>
      <Header className='toolbar-header'>
        <div className='toolbar-header-left'>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className='toolbar-header-center'>
          {profile?.publicKey ? (
            <Row
              justify='center'
              align='middle'
              style={{
                height: '100%',
                gap: '32px'
              }}
            >
              <div className='toolbar-header-item' onClick={() => showComingSoon()}>
                <FontAwesomeIcon icon={faWallet} className='toolbar-header-icon-disabled' />
                <span className='toolbar-header-text-disabled'>Wallet</span>
              </div>
              <div
                className={`toolbar-header-item ${state.renderState === Enums.appRenderState.DISTRO ? 'active' : ''}`}
                onClick={() => handleNavigate(Enums.appRenderState.DISTRO)}
              >
                <FontAwesomeIcon className='toolbar-header-icon' icon={faMoneyBillTransfer} />
                <span className='toolbar-header-text'>Distribute</span>
              </div>
              <div className='toolbar-header-item' onClick={() => showComingSoon()}>
                <FontAwesomeIcon className='toolbar-header-icon-disabled' icon={faMessage} />
                <span className='toolbar-header-text-disabled'>Messages</span>
              </div>
              <div className='toolbar-header-item' onClick={onNotificationsClick}>
                <FontAwesomeIcon className='toolbar-header-icon' icon={faBell} />
                <Badge className='toolbar-header-text' count={unreadCount} offset={[20, -5]}>
                  Notifications
                </Badge>
              </div>
            </Row>
          ) : undefined}
        </div>

        <div className='toolbar-header-right'>{profile?.publicKey ? <ToolbarDropDown /> : null}</div>
      </Header>
      {profile?.publicKey && (
        <Footer className='toolbar-footer'>
          <Row
            justify='space-between'
            align='middle'
            style={{
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto',
              height: '100%',
              padding: '8px 20px'
            }}
          >
            <Col className='toolbar-footer-item' onClick={() => showComingSoon()}>
              <FontAwesomeIcon icon={faWallet} className='toolbar-footer-icon-disabled' />
              <div className='toolbar-footer-text-disabled'>Wallet</div>
            </Col>
            <Col
              className={`toolbar-footer-item ${state.renderState === Enums.appRenderState.DISTRO ? 'active' : ''}`}
              onClick={() => handleNavigate(Enums.appRenderState.DISTRO)}
            >
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faMoneyBillTransfer} />
              <div className='toolbar-footer-text'>Distribute</div>
            </Col>
            <Col className='toolbar-footer-item' onClick={() => showComingSoon()}>
              <FontAwesomeIcon className='toolbar-footer-icon-disabled' icon={faMessage} />
              <div className='toolbar-footer-text-disabled'>Messages</div>
            </Col>
            <Col className={'toolbar-footer-item'} onClick={onNotificationsClick}>
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faBell} />
              <Badge className='toolbar-footer-text' count={unreadCount} offset={[0, -30]}>
                Notifications
              </Badge>
            </Col>
          </Row>
        </Footer>
      )}
    </Layout>
  )
}

export default Toolbar
