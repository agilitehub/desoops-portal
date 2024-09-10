import React from 'react'
import logo from '../../../assets/deso-ops-logo-full-dark.png'

import './style.sass'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/'>
      <div className='logo'>
        <img src={logo} alt={process.env.REACT_APP_NAME} />
      </div>
    </Link>
  )
}

export default Logo
