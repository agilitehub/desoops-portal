import React from 'react'

import { Layout, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { BrowserView } from 'react-device-detect'
import ToolbarDropDown from './ToolbarDropDown'

const Toolbar = ({ title }) => {
  const { token } = theme.useToken()

  return (
    <Layout style={{ margin: 0 }}>
      <Header
        style={{
          fontSize: '13pt',
          backgroundColor: token.colorPrimary,
          color: 'white',
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <BrowserView>
              <h4 style={{ margin: 0 }}>{title}</h4>
            </BrowserView>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ToolbarDropDown />
          </div>
        </div>
      </Header>
    </Layout>
  )
}

export default Toolbar
