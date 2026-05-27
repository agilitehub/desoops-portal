import React, { useEffect, useState } from 'react'
import { Dropdown, Image, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { BellOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'

import { desoLogout } from 'core/infra/deso-controller-graphql'
import { setEditProfileVisible, setEditNotificationsVisible } from 'core/store/slices/custom/reducer'

const ToolbarDropDown = () => {
  const dispatch = useDispatch()
  const [profilePic, setProfilePic] = useState(false)
  const profile = useSelector((state) => state.custom.desoData.profile)

  const handleGetItems = () => {
    const dropDownItems = {
      editProfile: {
        icon: <UserOutlined className='text-base' />,
        danger: false,
        key: 'Edit Profile',
        label: 'Profile',
        className: 'text-lg max-sm:text-sm',
        onClick: () => dispatch(setEditProfileVisible(true))
      },
      editNotifications: {
        icon: <BellOutlined className='text-base' />,
        danger: false,
        key: 'Deposit Settings',
        label: 'Deposit Settings',
        className: 'text-lg max-sm:text-sm',
        onClick: () => dispatch(setEditNotificationsVisible(true))
      },
      signOut: {
        danger: true,
        key: 'Sign Out',
        label: 'Sign Out',
        className: 'text-lg max-sm:text-sm',
        onClick: desoLogout
      },
      version: {
        key: 'version',
        disabled: true,
        label: `Version ${process.env.REACT_APP_VERSION}`,
        className: 'text-lg max-sm:text-sm'
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
        className='mr-[-25px] mt-3 flex h-10 justify-end border-0 bg-transparent text-lg text-white max-sm:mr-[-35px] max-sm:mt-[9px] max-sm:h-[35px] max-sm:text-sm'
        trigger={['click']}
        menu={{
          items: handleGetItems()
        }}
      >
        <Space className='mt-2.5 cursor-pointer'>
          {profilePic ? (
            <Image src={profile.profilePicUrl} className='!mt-[-2px] !h-[35px] !w-[35px] rounded-lg max-sm:!h-[25px] max-sm:!w-[25px]' preview={false} />
          ) : (
            <UserOutlined className='text-xl' />
          )}
          <span className='text-white'>{profile.username}</span>
          <DownOutlined className='text-white' />
        </Space>
      </Dropdown>
    </div>
  )
}

export default ToolbarDropDown
