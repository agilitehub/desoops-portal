import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Col, Layout, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import Enums from '../../lib/enums'

import './style.sass'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faMessage, faWallet, faCommentsDollar } from '@fortawesome/free-solid-svg-icons'
import { setComingSoon } from '../../../custom/reducer'

const Toolbar = ({ state, setState, onNotificationsClick }) => {
  const dispatch = useDispatch()
  const profile = useSelector((state) => state.custom.desoData.profile)
  const unreadCount = useSelector((state) => state.custom.unreadCount)
  const [topOffset, setTopOffset] = useState(15)

  useEffect(() => {
    setTopOffset(unreadCount >= 10 ? 25 : 15)
  }, [unreadCount])

  const handleNavigate = (renderState) => {
    setState({ renderState })
  }

  useEffect(() => {
    if (state.renderState === Enums.appRenderState.LAUNCH) {
      setState({ renderState: Enums.appRenderState.DISTRO })
    }

    // eslint-disable-next-line
  }, [state.renderState])

  const showComingSoon = (title, description) => {
    dispatch(setComingSoon({ isVisible: true, title, description }))
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
              <div className='toolbar-header-item' onClick={() => showComingSoon('Wallet Dashboard Coming Soon', 'Soon you\'ll be able to view true moneytary values across all your crypto assets in your DeSo Wallet.')}>
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
              <div className='toolbar-header-item' onClick={() => showComingSoon('Messages Coming Soon', 'Soon you\'ll be able to send and receive direct and group messages with other DeSo users.')}>
                <FontAwesomeIcon className='toolbar-header-icon-disabled' icon={faMessage} />
                <span className='toolbar-header-text-disabled'>Messages</span>
              </div>
              <div className='toolbar-header-item' onClick={onNotificationsClick}>
                <FontAwesomeIcon className='toolbar-header-icon' icon={faCommentsDollar} />
                <Badge className='toolbar-header-text' count={unreadCount} offset={[topOffset]}>
                  Deposits
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
            <Col className='toolbar-footer-item' onClick={() => showComingSoon('Wallet Dashboard Coming Soon', 'Soon you\'ll be able to view true moneytary values across all your crypto assets in your DeSo Wallet.')}>
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
            <Col className='toolbar-footer-item' onClick={() => showComingSoon('Messages Coming Soon', 'Soon you\'ll be able to send and receive direct and group messages with other DeSo users.')}>
              <FontAwesomeIcon className='toolbar-footer-icon-disabled' icon={faMessage} />
              <div className='toolbar-footer-text-disabled'>Messages</div>
            </Col>
            <Col className={'toolbar-footer-item'} onClick={onNotificationsClick}>
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faCommentsDollar} />
              <Badge className='toolbar-footer-text' count={unreadCount} offset={[0, -25]}>
                Deposits
              </Badge>
            </Col>
          </Row>
        </Footer>
      )}
    </Layout>
  )
}

export default Toolbar
