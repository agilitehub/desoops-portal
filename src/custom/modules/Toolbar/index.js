import React from 'react'

import { Layout, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import ToolbarDropDown from './ToolbarDropDown'
import { setLeftMenu } from '../../reducer'
// import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import LeftMenu from '../LeftMenu'

const Toolbar = ({ deviceType }) => {
  const { token } = theme.useToken()
  const leftMenuState = useSelector((state) => state.custom.leftMenu)
  const dispatch = useDispatch()

  const styleProps = {
    header: {
      backgroundColor: token.colorPrimary,
      height: deviceType.isSmartphone ? 45 : 60,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    userDropdown: { marginTop: -10, marginRight: -40 },
    leftMenu: { marginTop: -7, marginLeft: -10 },
    menuBtn: { backgroundColor: token.colorPrimary, borderColor: token.colorPrimary, fontSize: 22 }
  }

  const handleToggleMenu = () => {
    dispatch(setLeftMenu({ ...leftMenuState, open: !leftMenuState.open }))
  }

  const handleMenuClick = async (event) => {
    const activeKey = event.key

    // Trigger the relevant Quick Action

    dispatch(setLeftMenu({ ...leftMenuState, activeKey, open: !leftMenuState.open }))
  }

  return (
    <Layout style={{ margin: 0 }}>
      <Header style={styleProps.header}>
        {/* {deviceType.isSmartphone ? (
          <div style={styleProps.leftMenu}>
            <Button type='primary' onClick={handleToggleMenu} style={styleProps.menuBtn}>
              {!leftMenuState.open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
        ) : null} */}
        <div style={styleProps.userDropdown}>
          <ToolbarDropDown deviceType={deviceType} />
        </div>
      </Header>
      <LeftMenu
        deviceType={deviceType}
        onMenuClick={handleMenuClick}
        onToggleMenu={handleToggleMenu}
        menuState={leftMenuState}
      />
    </Layout>
  )
}

export default Toolbar
