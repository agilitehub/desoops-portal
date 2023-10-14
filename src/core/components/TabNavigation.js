import React from 'react'

import { Tabs } from 'antd'
import App from 'app'

const TabNavigation = (props) => {
  const CustomRootContent = props.state.rootContent || App

  return (
    <Tabs
      style={{ padding: '0 4px' }}
      activeKey={props.activeKey}
      animated={props.animated}
      type='editable-card'
      hideAdd
      centered={true}
      onChange={props.onTabChange}
      onEdit={props.onTabClose}
      tabBarStyle={{ display: props.hidden ? 'none' : 'block' }}
      items={[
        { key: props.rootTabKey, label: props.rootTabTitle, children: <CustomRootContent />, closable: false },
        ...props.tabs
      ]}
    />
  )
}

export default TabNavigation
