import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'

import logo from 'assets/deso-ops-logo-full.png'
import logoDark from 'assets/deso-ops-logo-full-dark.png'
import Enums from 'lib/enums'

import './style.sass'

const Logo = () => {
  const { colorMode } = useColorMode()

  return (
    <div className='logo'>
      {colorMode === Enums.colorMode.LIGHT ? (
        <img src={logo} alt={process.env.REACT_APP_NAME} />
      ) : (
        <img src={logoDark} alt={process.env.REACT_APP_NAME} />
      )}
    </div>
  )
}

export default Logo
