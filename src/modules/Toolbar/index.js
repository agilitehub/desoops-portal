import React from 'react'

import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'

import './style.sass'
import Logo from './Logo'
import RightSection from './RigthSection'

const Toolbar = () => {
  return (
    <Layout className='layout'>
      <Header className='header'>
        <Logo />
        <RightSection />
      </Header>
    </Layout>
  )
}

export default Toolbar
