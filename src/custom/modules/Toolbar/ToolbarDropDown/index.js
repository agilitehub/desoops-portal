import React, { useEffect, useState } from 'react'
import { Dropdown, Image, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'

import { desoLogout } from '../../../lib/deso-controller-graphql'

import './style.sass'
import { setEditProfileVisible, setEditNotificationsVisible } from '../../../reducer'

const ToolbarDropDown = () => {
  const dispatch = useDispatch()
  const [profilePic, setProfilePic] = useState(false)
  const profile = useSelector((state) => state.custom.desoData.profile)

  const handleGetItems = () => {
    const dropDownItems = {
      editProfile: {
        icon: <UserOutlined style={{ fontSize: 16 }} />,
        danger: false,
        key: 'Edit Profile',
        label: 'Profile',
        className: 'dropdown-item',
        onClick: () => dispatch(setEditProfileVisible(true))
      },
      editNotifications: {
        icon: <BellOutlined style={{ fontSize: 16 }} />,
        danger: false,
        key: 'Edit Notifications',
        label: 'Notifications',
        className: 'dropdown-item',
        onClick: () => dispatch(setEditNotificationsVisible(true))
      },
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

    return [dropDownItems.editProfile, dropDownItems.editNotifications, dropDownItems.signOut, dropDownItems.version]
  }

  useEffect(() => {
    const handleValidateProfilePic = async () => {
      try {
        setProfilePic(false)

        const response = await fetch(profile.profilePicUrl)

        if (response.status === 200) {
          setProfilePic(true)
        } else {
          setProfilePic(false)
        }
      } catch (e) {}
    }

    if (profile.profilePicUrl) {
      handleValidateProfilePic()
    } else {
      setProfilePic(false)
    }

    // eslint-disable-next-line
  }, [profile])

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
          {profilePic ? (
            <Image src={profile.profilePicUrl} className='toolbar-dropdown-btn-icon' preview={false} />
          ) : (
            <UserOutlined style={{ fontSize: 20 }} />
          )}
          {profile.username}
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  )
}

export default ToolbarDropDown
