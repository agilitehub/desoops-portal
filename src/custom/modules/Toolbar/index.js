import React from 'react'
import { useSelector } from 'react-redux'
import { Col, Layout, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import Enums from '../../lib/enums'

import './style.sass'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTransfer, faMessage, faBell, faWallet } from '@fortawesome/free-solid-svg-icons'

const Toolbar = ({ state, setState }) => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  const handleNavigate = (renderState) => {
    setState({ renderState })
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
              <div className='toolbar-header-item'>
                <FontAwesomeIcon icon={faWallet} className='toolbar-header-icon' />
                <span className='toolbar-header-text'>Wallet</span>
              </div>
              <div
                className={`toolbar-header-item ${state.renderState === Enums.appRenderState.DISTRO ? 'active' : ''}`}
                onClick={() => handleNavigate(Enums.appRenderState.DISTRO)}
              >
                <FontAwesomeIcon className='toolbar-header-icon' icon={faMoneyBillTransfer} />
                <span className='toolbar-header-text'>Distribute</span>
              </div>
              <div className='toolbar-header-item'>
                <FontAwesomeIcon className='toolbar-header-icon' icon={faMessage} />
                <span className='toolbar-header-text'>Messages</span>
              </div>
              <div
                className={`toolbar-header-item ${
                  state.renderState === Enums.appRenderState.NOTIFICATIONS ? 'active' : ''
                }`}
                onClick={() => handleNavigate(Enums.appRenderState.NOTIFICATIONS)}
              >
                <FontAwesomeIcon className='toolbar-header-icon' icon={faBell} />
                <span className='toolbar-header-text'>Notifications</span>
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
            <Col className='toolbar-footer-item'>
              <FontAwesomeIcon icon={faWallet} className='toolbar-footer-icon' />
              <div className='toolbar-footer-text'>Wallet</div>
            </Col>
            <Col
              className={`toolbar-footer-item ${state.renderState === Enums.appRenderState.DISTRO ? 'active' : ''}`}
              onClick={() => handleNavigate(Enums.appRenderState.DISTRO)}
            >
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faMoneyBillTransfer} />
              <div className='toolbar-footer-text'>Distribute</div>
            </Col>
            <Col className='toolbar-footer-item'>
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faMessage} />
              <div className='toolbar-footer-text'>Messages</div>
            </Col>
            <Col
              className={`toolbar-footer-item ${
                state.renderState === Enums.appRenderState.NOTIFICATIONS ? 'active' : ''
              }`}
              onClick={() => handleNavigate(Enums.appRenderState.NOTIFICATIONS)}
            >
              <FontAwesomeIcon className='toolbar-footer-icon' icon={faBell} />
              <div className='toolbar-footer-text'>Notifications</div>
            </Col>
          </Row>
        </Footer>
      )}
    </Layout>
  )
}

export default Toolbar
