import React, { useEffect, useState } from 'react'
import mergeWith from 'lodash/mergeWith'
import isArray from 'lodash/isArray'
import { Button, ConfigProvider, message, theme, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

// Utils
import CoreEnums from '../utils/enums'
import { coreState } from '../utils/core-state'

// Components
import TabNavigation from './TabNavigation'
import Toolbar from './Toolbar'
import App from 'modules/CoreApp'

// Theme
import { darkTheme, lightTheme } from '../utils/antd-theme'

const Core = (customProps) => {
  const [themeButtonDisabled, setThemeButtonDisabled] = useState(false)
  const RootContent = customProps.state.rootContent || App
  const [motionUnit, setMotionUnit] = useState(0.1)
  const customizer = (objValue, srcValue) => {
    if (isArray(objValue)) return srcValue
  }
  const props = mergeWith(Object.assign({}, coreState), Object.assign({}, customProps), customizer)

  // Messages
  message.config({ duration: 5, maxCount: 2, prefixCls: 'agilite_message' })

  // Theme
  const [themeToken, setThemeToken] = useState(
    JSON.parse(localStorage.getItem(CoreEnums.localStorage.THEME_TOKEN)) || lightTheme
  )
  const [isDarkTheme, setIsDarkTheme] = useState(
    JSON.parse(localStorage.getItem(CoreEnums.localStorage.IS_DARK_THEME)) || false
  )

  useEffect(() => {
    document.body.style.backgroundColor = themeToken.colorBgBase
    // Change the motion unit to 0.1 again
    setMotionUnit(0.1)
    setThemeButtonDisabled(false)
  }, [themeToken])

  useEffect(() => {
    if (motionUnit === 0) {
      if (isDarkTheme) {
        localStorage.setItem(CoreEnums.localStorage.IS_DARK_THEME, false)
        localStorage.setItem(CoreEnums.localStorage.THEME_TOKEN, JSON.stringify(lightTheme))

        setIsDarkTheme(false)
        setThemeToken(lightTheme)
      } else {
        localStorage.setItem(CoreEnums.localStorage.IS_DARK_THEME, true)
        localStorage.setItem(CoreEnums.localStorage.THEME_TOKEN, JSON.stringify(darkTheme))

        setIsDarkTheme(true)
        setThemeToken(darkTheme)
      }
    }
    // eslint-disable-next-line
  }, [motionUnit])
  const { token } = theme.useToken()
  const handleThemeToggle = () => {
    // We need to set the motion unit to 0 so that there is not transition when changing the theme
    // This state change triggers the useEffect above
    setMotionUnit(0)
    setThemeButtonDisabled(true)
  }

  const themeToggle = () => {
    return (
      <Tooltip title={`Toggle ${isDarkTheme ? 'Light Mode' : 'Dark Mode'}`}>
        <Button
          style={{ background: 'transparent', border: 'none', padding: 0, margin: 0 }}
          disabled={themeButtonDisabled}
          onClick={handleThemeToggle}
        >
          <FontAwesomeIcon fontSize={17} color={token.colorWhite} icon={isDarkTheme ? faMoon : faSun} />
        </Button>
      </Tooltip>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
          ...themeToken,
          motionUnit
        },
        components: {
          Card: {
            colorBgContainer: '#fff',
            colorFillAlter: '#DDE6ED'
          },
          Input: {
            colorBgContainer: 'white'
          },
          InputNumber: {
            colorBgContainer: 'white'
          },
          Tooltip: {
            colorBgDefault: '#1b1b1b'
          },
          Divider: {
            colorSplit: themeToken.colorWhite
          },
          Table: {},
          Carousel: {
            colorBgContainer: themeToken.colorPrimary,
            dotHeight: 7.5,
            dotWidth: 20,
            dotWidthActive: 30
          },
          Select: {
            colorBgContainer: 'white',
            colorTextPlaceholder: 'black'
          },
          DatePicker: {
            colorBgContainer: 'white'
          },
          Radio: {
            colorBgContainer: 'white'
          }
        }
      }}
    >
      <div>
        {props.state.toolbar.enabled ? (
          <Toolbar
            isDarkTheme={isDarkTheme}
            themeToggle={themeToggle}
            {...props.state.leftMenu}
            {...props.state.rightMenu}
            {...props.state.toolbar}
            {...props.state.theme}
          />
        ) : null}
        {props.state.leftMenu.leftMenuEnabled ? null : null}
        {props.state.rightMenu.rightMenuEnabled ? null : null}
        {props.state.tabNavigation.enabled ? (
          <TabNavigation {...props.state.tabNavigation} {...props} />
        ) : (
          <RootContent />
        )}
      </div>
    </ConfigProvider>
  )
}

export default Core
