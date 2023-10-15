import React from 'react'

import ToolbarDropDown from './ToolbarDropDown'
import ThemeToggle from './ThemeToggle'

import './style.sass'
import { useSelector } from 'react-redux'

const RightSection = () => {
  const profile = useSelector((state) => state.core.desoData.profile)

  return (
    <div className='right-section'>
      <ThemeToggle />
      {profile.publicKey ? <ToolbarDropDown /> : null}
    </div>
  )
}

export default RightSection
