import React from 'react'

import { Layout, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import ToolbarDropDown from './ToolbarDropDown'

const Toolbar = ({ deviceType }) => {
  const { token } = theme.useToken()

  const styleProps = {
    header: {
      backgroundColor: token.colorPrimary,
      height: deviceType.isSmartphone ? 45 : 60,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    userDropdown: { marginTop: deviceType.isSmartphone ? -10 : -3, marginRight: -40 }
  }

  return (
    <Layout style={{ margin: 0 }}>
      <Header style={styleProps.header}>
        <div style={styleProps.userDropdown}>
          <ToolbarDropDown deviceType={deviceType} />
        </div>
      </Header>
    </Layout>
  )
}

export default Toolbar
