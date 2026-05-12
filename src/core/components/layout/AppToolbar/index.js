import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge, Col, Layout, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'
import './style.sass'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { MAIN_TOOLBAR_ITEMS } from 'core/config/navigation'
import { buildAppPath } from '../../../../constants/paths'

const headerLinkClass = ({ isActive }) => `toolbar-header-item${isActive ? ' active' : ''}`
const footerLinkClass = ({ isActive }) => `toolbar-footer-item${isActive ? ' active' : ''}`

const AppToolbar = ({ onNotificationsClick }) => {
  const profile = useSelector((sel) => sel.custom.desoData.profile)
  const unreadCount = useSelector((sel) => sel.custom.unreadCount)
  const [topOffset, setTopOffset] = useState(15)

  useEffect(() => {
    setTopOffset(unreadCount >= 10 ? 25 : 15)
  }, [unreadCount])

  const desktopNavItems = MAIN_TOOLBAR_ITEMS.map((item) =>
    item.deposits ? (
      <div key={item.key} className='toolbar-header-item' onClick={() => onNotificationsClick?.()}>
        <FontAwesomeIcon className='toolbar-header-icon' icon={item.icon} />
        <Badge className='toolbar-header-text' count={unreadCount} offset={[topOffset]}>
          {item.label}
        </Badge>
      </div>
    ) : (
      <NavLink key={item.key} to={buildAppPath(item.segment)} className={headerLinkClass}>
        <FontAwesomeIcon icon={item.icon} className='toolbar-header-icon' />
        <span className='toolbar-header-text'>{item.label}</span>
      </NavLink>
    )
  )

  const footerNavItems = MAIN_TOOLBAR_ITEMS.map((item) =>
    item.deposits ? (
      <Col key={item.key} className='toolbar-footer-item' onClick={() => onNotificationsClick?.()}>
        <FontAwesomeIcon className='toolbar-footer-icon' icon={item.icon} />
        <Badge className='toolbar-footer-text' count={unreadCount} offset={[0, -25]}>
          {item.label}
        </Badge>
      </Col>
    ) : (
      <Col key={item.key}>
        <NavLink to={buildAppPath(item.segment)} className={footerLinkClass}>
          <FontAwesomeIcon icon={item.icon} className='toolbar-footer-icon' />
          <div className='toolbar-footer-text'>{item.label}</div>
        </NavLink>
      </Col>
    )
  )

  return (
    <Layout className='toolbar-layout'>
      <Header className='toolbar-header'>
        <div className='toolbar-header-left'>
          <Logo />
        </div>

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
              {desktopNavItems}
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
            {footerNavItems}
          </Row>
        </Footer>
      )}
    </Layout>
  )
}

export default AppToolbar
