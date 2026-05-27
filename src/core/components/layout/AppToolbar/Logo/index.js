import React from 'react'
import logo from 'assets/deso-ops-logo-full-dark.png'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/'>
      <div className='mx-0 flex h-12 items-center max-sm:h-10'>
        <img
          src={logo}
          alt={process.env.REACT_APP_NAME}
          className='block h-12 w-auto max-w-[200px] object-contain max-sm:h-10 max-sm:max-w-[160px]'
        />
      </div>
    </Link>
  )
}

export default Logo
