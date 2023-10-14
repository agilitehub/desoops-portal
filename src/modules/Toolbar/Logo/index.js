import React from 'react'

import logo from 'custom/assets/deso-ops-logo-full.png'

import './style.sass'

const Logo = () => {
  return (
    <div className='logo'>
      <img src={logo} alt={process.env.REACT_APP_NAME} />
    </div>
  )
}

export default Logo
