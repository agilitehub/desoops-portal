import React from 'react'

import { Layout, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import ToolbarDropDown from './ToolbarDropDown'

const Toolbar = ({ deviceType }) => {
  const { token } = theme.useToken()

  const styleProps = {
    header: {
      backgroundColor: token.colorPrimary,
      paddingRight: 20,
      height: deviceType.isSmartphone ? 45 : 60,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }

  return (
    <Layout style={{ margin: 0 }}>
      <Header style={styleProps.header}>
        <ToolbarDropDown deviceType={deviceType} />
      </Header>
    </Layout>
  )
}

export default Toolbar
