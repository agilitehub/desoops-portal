import React from 'react'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'

import ToolbarDropDown from './ToolbarDropDown'
import Logo from './Logo'

import './style.sass'

const Toolbar = () => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  return (
    <Layout className='toolbar-layout'>
      <Header className='toolbar-header'>
        <Logo />

        {profile?.publicKey ? <ToolbarDropDown /> : null}
      </Header>
    </Layout>
  )
}

export default Toolbar
