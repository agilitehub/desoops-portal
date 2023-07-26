import React from 'react'
import { Drawer, Menu, theme } from 'antd'

// Components
import {
  ClockCircleOutlined,
  CloseOutlined,
  CopyOutlined,
  HomeOutlined,
  ReloadOutlined,
  RollbackOutlined
} from '@ant-design/icons'

const LeftMenu = ({ menuState, onMenuClick, onToggleMenu, deviceType }) => {
  const { token } = theme.useToken()

  const styleProps = {
    menuItemLabel: {
      fontSize: deviceType.isSmartphone ? 14 : 16
    }
  }

  const menuItems = [
    {
      key: 'home',
      label: (
        <span style={styleProps.menuItemLabel}>
          <HomeOutlined /> Home
        </span>
      )
    },
    {
      key: 'quick-actions',
      label: (
        <span style={styleProps.menuItemLabel}>
          <ClockCircleOutlined /> Quick Actions
        </span>
      ),
      children: [
        {
          key: 'quick-actions-reset',
          label: (
            <span style={styleProps.menuItemLabel}>
              <RollbackOutlined /> Reset Dashboard
            </span>
          )
        },
        {
          key: 'quick-actions-refresh',
          label: (
            <span style={styleProps.menuItemLabel}>
              <ReloadOutlined /> Refresh Dashboard
            </span>
          )
        },
        {
          key: 'quick-actions-copy',
          label: (
            <span style={styleProps.menuItemLabel}>
              <CopyOutlined /> Copy To Clipboard
            </span>
          )
        }
      ]
    }
  ]

  return (
    <Drawer
      title={<span style={{ color: 'white' }}>Left Menu</span>}
      placement='left'
      closable={true}
      width={250}
      open={menuState.open}
      onClose={onToggleMenu}
      headerStyle={{
        backgroundColor: token.colorPrimary
      }}
      closeIcon={<CloseOutlined style={{ color: 'white' }} />}
    >
      <Menu
        onClick={onMenuClick}
        selectedKeys={menuState.activeKey}
        defaultSelectedKeys={['home']}
        mode='inline'
        items={menuItems}
      />
    </Drawer>
  )
}

export default LeftMenu
