import React from 'react'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'

import './style.sass'

const Toolbar = () => {
  return (
    <Layout className='toolbar-layout'>
      <Header className='toolbar-header'>
        <Logo />
        <ToolbarDropDown />
      </Header>
    </Layout>
  )
}

export default Toolbar
