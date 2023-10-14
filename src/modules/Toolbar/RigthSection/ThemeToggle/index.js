import React from 'react'

import { Switch } from 'antd'
import { useColorMode } from '@chakra-ui/color-mode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import './style.sass'
import Enums from 'custom/lib/enums'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <div className='theme-toggle'>
      <Switch
        className='switch'
        checked={colorMode === Enums.colorMode.LIGHT}
        unCheckedChildren={
          <>
            <FontAwesomeIcon icon={faMoon} />
          </>
        }
        checkedChildren={
          <>
            <FontAwesomeIcon className='icon-sun' icon={faSun} />
          </>
        }
        onChange={toggleColorMode}
      />
    </div>
  )
}

export default ThemeToggle
