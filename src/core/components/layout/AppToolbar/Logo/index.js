import React from 'react'
import logo from 'assets/deso-ops-logo-full-dark.png'
import { Link } from 'react-router-dom'

const APP_NAME = process.env.REACT_APP_NAME || 'DeSoOps'

const Logo = () => {
  return (
    <Link to='/' className='group flex min-w-0 items-center gap-2 no-underline sm:gap-3'>
      <img
        src={logo}
        alt=''
        aria-hidden
        className='block h-10 w-auto max-w-[140px] shrink-0 object-contain sm:h-12 sm:max-w-[168px]'
      />
      <span className='truncate text-lg font-extrabold tracking-tight text-deso-orange sm:text-xl'>{APP_NAME}</span>
    </Link>
  )
}

export default Logo
