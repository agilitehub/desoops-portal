import React from 'react'
import logo from '../../../assets/deso-ops-logo-full-dark.png'

import './style.sass'

const Logo = () => {
  return (
    <div className='logo'>
      <img src={logo} alt={process.env.REACT_APP_NAME} />
    </div>
  )
}

export default Logo
