import React, { useState } from 'react'
import { Button, Dropdown, Image, Space } from 'antd'
import { Text, Group } from '@mantine/core'
import { useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import { MdOutlineKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

import { desoLogout } from 'custom/lib/deso-controller-graphql'

import './style.sass'

const ToolbarDropDown = () => {
  const [menuOpen, setMenuOpen] = useState(false)
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

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div>
      <Dropdown
        className='toolbar-dropdown'
        trigger={['click']}
        menu={{
          items: handleGetItems()
        }}
        onOpenChange={(open) => setMenuOpen(open)}
      >
        <Button
          icon={<Image src={profile.profilePicUrl} className='toolbar-dropdown-btn-icon' preview={false} />}
          onClick={handleMenuClick}
        >
          <Group gap='sm'>
            <Text size='md'>{profile.username}</Text>
            {menuOpen ? <MdKeyboardArrowUp size='1.5rem' /> : <MdOutlineKeyboardArrowDown size='1.5rem' />}
          </Group>
        </Button>
      </Dropdown>
    </div>
  )
}

export default ToolbarDropDown
