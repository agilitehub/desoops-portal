import React from 'react'
import { Button, Dropdown, Image, Space } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons'

import { desoLogout } from '../../../lib/deso-controller'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'

const ToolbarDropDown = () => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  const handleGetItems = () => {
    const dropDownItems = {
      signOut: {
        danger: true,
        key: 'Sign Out',
        label: 'Sign Out',
        onClick: desoLogout
      },
      version: {
        key: 'version',
        disabled: true,
        label: <small>Version {process.env.REACT_APP_VERSION}</small>
      }
    }

    return [dropDownItems.signOut, dropDownItems.version]
  }

  return (
    <>
      {/* Note: No need to end any custom toolbar components with a Divider */}
      <Dropdown
        trigger={['click']}
        menu={{
          items: handleGetItems()
        }}
      >
        <Button
          style={{ height: 50, marginTop: 5, backgroundColor: 'transparent', color: 'white', border: 'none' }}
          icon={
            <Image
              src={profile.profilePicUrl}
              width={35}
              height={35}
              style={{ borderRadius: 8, marginLeft: -10 }}
              preview={false}
            />
          }
        >
          <Space>
            {profile.username}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  )
}

export default ToolbarDropDown
