import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Badge, Col, Layout, Row } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'

import { MAIN_TOOLBAR_ITEMS } from 'core/config/navigation'
import { buildAppPath } from '../../../../constants/paths'

const headerLinkClass = ({ isActive }) => `toolbar-header-item${isActive ? ' active' : ''}`
const footerLinkClass = ({ isActive }) => `toolbar-footer-item${isActive ? ' active' : ''}`

const AppToolbar = ({ onNotificationsClick }) => {
  const profile = useSelector((sel) => sel.custom.desoData.profile)
  const unreadCount = useSelector((sel) => sel.custom.unreadCount)
  const [topOffset, setTopOffset] = useState(15)
  const isAuthenticated = Boolean(profile?.publicKey)

  useEffect(() => {
    setTopOffset(unreadCount >= 10 ? 25 : 15)
  }, [unreadCount])

  const desktopNavItems = MAIN_TOOLBAR_ITEMS.map((item) =>
    item.deposits ? (
      <div key={item.key} className='toolbar-header-item' onClick={() => onNotificationsClick?.()}>
        <FontAwesomeIcon className='toolbar-header-icon text-[22px] text-white transition-[color,transform] duration-200' icon={item.icon} />
        <Badge className='toolbar-header-text text-sm font-semibold tracking-wide text-white/90 transition-colors duration-200 max-sm:hidden' count={unreadCount} offset={[topOffset]}>
          {item.label}
        </Badge>
      </div>
    ) : (
      <NavLink key={item.key} to={buildAppPath(item.segment)} className={headerLinkClass}>
        <FontAwesomeIcon icon={item.icon} className='toolbar-header-icon text-[22px] text-white transition-[color,transform] duration-200' />
        <span className='toolbar-header-text text-sm font-semibold tracking-wide text-white/90 transition-colors duration-200 max-sm:hidden'>{item.label}</span>
      </NavLink>
    )
  )

  const footerNavItems = MAIN_TOOLBAR_ITEMS.map((item) =>
    item.deposits ? (
      <Col key={item.key} className='toolbar-footer-item' onClick={() => onNotificationsClick?.()}>
        <FontAwesomeIcon className='toolbar-footer-icon mb-1 text-[26px] text-white/90 transition-colors duration-200 max-sm:text-2xl' icon={item.icon} />
        <Badge className='toolbar-footer-text mt-0.5 text-xs text-white/90 transition-colors duration-200' count={unreadCount} offset={[0, -25]}>
          {item.label}
        </Badge>
      </Col>
    ) : (
      <Col key={item.key}>
        <NavLink to={buildAppPath(item.segment)} className={footerLinkClass}>
          <FontAwesomeIcon icon={item.icon} className='toolbar-footer-icon mb-1 text-[26px] text-white/90 transition-colors duration-200 max-sm:text-2xl' />
          <div className='toolbar-footer-text mt-0.5 text-xs text-white/90 transition-colors duration-200'>{item.label}</div>
        </NavLink>
      </Col>
    )
  )

  return (
    <Layout className='sticky top-0 z-50 m-0 p-0 shadow-[0_4px_16px_rgba(28,75,115,0.18)]'>
      <Header className='toolbar-header-gradient flex h-16 flex-row items-center justify-between border-b-0 px-6 leading-none max-sm:h-[52px] max-sm:px-3'>
        <div className='flex min-w-0 shrink-0 items-center max-sm:max-w-[55%]'>
          <Logo />
        </div>

        <div className='flex min-w-0 flex-1 items-center justify-center max-sm:hidden'>
          {isAuthenticated ? <nav className='flex h-full items-center justify-center gap-8'>{desktopNavItems}</nav> : null}
        </div>

        <div className='flex min-w-[120px] shrink-0 items-center justify-end max-sm:min-w-0'>{isAuthenticated ? <ToolbarDropDown /> : null}</div>
      </Header>
      {isAuthenticated && (
        <Footer className='toolbar-header-gradient fixed bottom-0 z-[100] hidden h-[70px] w-full items-center border-t border-white/10 p-0 text-center max-sm:flex'>
          <Row className='mx-auto h-full w-full max-w-[400px] px-5 py-2' justify='space-between' align='middle'>
            {footerNavItems}
          </Row>
        </Footer>
      )}
    </Layout>
  )
}

export default AppToolbar
