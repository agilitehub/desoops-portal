import React from 'react'
import { Button, Dropdown, Image, Space } from 'antd'

import { desoLogout } from '../../../../lib/deso-controller'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'

import './style.sass'

const ToolbarDropDown = () => {
  const profile = useSelector((state) => state.core.desoData.profile)

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
        className: 'dropdown-item',
        label: `Version ${process.env.REACT_APP_VERSION}`
      }
    }

    return [dropDownItems.signOut, dropDownItems.version]
  }

  return (
    <div className='dropdown'>
      <Dropdown
        trigger={['click']}
        menu={{
          items: handleGetItems()
        }}
      >
        <Button className='button' icon={<Image src={profile.profilePicUrl} className='btn-icon' preview={false} />}>
          <Space>
            {profile.username}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  )
}

export default ToolbarDropDown
