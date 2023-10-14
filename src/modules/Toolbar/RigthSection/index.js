import React from 'react'

import ToolbarDropDown from './ToolbarDropDown'
import ThemeToggle from './ThemeToggle'

import './style.sass'

const RightSection = () => {
  return (
    <div className='right-section'>
      <ThemeToggle />
      <ToolbarDropDown />
    </div>
  )
}

export default RightSection
