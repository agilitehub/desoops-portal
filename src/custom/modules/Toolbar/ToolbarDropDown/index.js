import React from 'react'
import { Button, Dropdown, Image, Space } from 'antd'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'

import { desoLogout } from 'custom/lib/deso-controller-graphql'

import './style.sass'

const ToolbarDropDown = () => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  const handleGetItems = () => {
    const dropDownItems = {
      signOut: {
        danger: true,
        key: 'Sign Out',
        label: 'Sign Out',
        className: 'dropdown-item',
        onClick: desoLogout
      },
      version: {
        key: 'version',
        disabled: true,
        label: `Version ${process.env.REACT_APP_VERSION}`,
        className: 'dropdown-item'
      }
    }

    return [dropDownItems.signOut, dropDownItems.version]
  }

  return (
    <div>
      <Dropdown
        className='toolbar-dropdown'
        trigger={['click']}
        menu={{
          items: handleGetItems()
        }}
      >
        <Space style={{ cursor: 'pointer', marginTop: 10 }}>
          <Image src={profile.profilePicUrl} className='toolbar-dropdown-btn-icon' preview={false} />
          {profile.username}
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  )
}

export default ToolbarDropDown
