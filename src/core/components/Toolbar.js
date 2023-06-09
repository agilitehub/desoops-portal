import React, { useEffect } from 'react'

import { Divider, Layout, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { MenuOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { BrowserView } from 'react-device-detect'

// Components

const Toolbar = (props) => {
  const authState = useSelector((state) => state.auth)
  const { token } = theme.useToken()
  const location = useLocation()

  useEffect(() => {
    async function init() {
      try {
      } catch (e) {
        console.error(e)
      }
    }

    init()
    // eslint-disable-next-line
  }, [])

  return (
    <Layout style={authState.loggedIn ? { margin: 0 } : { margin: 0, display: 'none' }}>
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
            {props.leftMenuEnabled ? (
              <MenuOutlined style={{ float: 'left', cursor: 'pointer' }} onClick={props.onLeftMenuOpen} />
            ) : null}
            <BrowserView>
              <h4 style={{ margin: 0 }}>{props.title}</h4>
            </BrowserView>
          </div>
          {location.pathname !== '/checkin' || authState.loggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {props.customMenus.content}
              {props.rightMenuEnabled ? (
                <>
                  <Divider type='vertical' />
                  <MenuOutlined
                    style={{
                      cursor: 'pointer'
                    }}
                    onClick={props.onRightMenuOpen}
                  />
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </Header>
    </Layout>
  )
}

export default Toolbar
