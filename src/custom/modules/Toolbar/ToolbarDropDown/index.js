import React from 'react'
import { Button, Dropdown, Image, Space } from 'antd'

import { desoLogout } from '../../../lib/deso-controller'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'

const ToolbarDropDown = ({ deviceType }) => {
  const profile = useSelector((state) => state.custom.desoData.profile)

  const styleProps = {
    btn: {
      height: 40,
      marginTop: 3,
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      fontSize: deviceType.isSmartphone ? 14 : 18
    },
    btnIcon: { borderRadius: 8, width: deviceType.isSmartphone ? 25 : 35, height: deviceType.isSmartphone ? 25 : 35 },
    dropdownItems: { fontSize: deviceType.isSmartphone ? 14 : 18 }
  }

  const handleGetItems = () => {
    const dropDownItems = {
      signOut: {
        danger: true,
        key: 'Sign Out',
        label: 'Sign Out',
        style: styleProps.dropdownItems,
        onClick: desoLogout
      },
      version: {
        key: 'version',
        disabled: true,
        label: `Version ${process.env.REACT_APP_VERSION}`,
        style: styleProps.dropdownItems
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
          style={styleProps.btn}
          icon={<Image src={profile.profilePicUrl} style={styleProps.btnIcon} preview={false} />}
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
