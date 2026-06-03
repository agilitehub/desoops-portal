import React, { useEffect, useState } from 'react'
import { Dropdown, Image } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { DownOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'

import { desoLogout } from 'core/infra/deso-controller-graphql'
import { setEditProfileVisible, setEditNotificationsVisible } from 'core/store/slices/custom/reducer'

const ToolbarDropDown = () => {
  const dispatch = useDispatch()
  const [profilePic, setProfilePic] = useState(false)
  const profile = useSelector((state) => state.custom.desoData.profile)

  const dropDownItems = [
    {
      icon: <FontAwesomeIcon icon={faUser} className='w-4 text-deso-blue' />,
      key: 'Edit Profile',
      label: 'Profile',
      className: 'toolbar-user-dropdown-item',
      onClick: () => dispatch(setEditProfileVisible(true))
    },
    {
      icon: <FontAwesomeIcon icon={faBell} className='w-4 text-deso-orange' />,
      key: 'Deposit Settings',
      label: 'Deposit Settings',
      className: 'toolbar-user-dropdown-item',
      onClick: () => dispatch(setEditNotificationsVisible(true))
    },
    {
      icon: <FontAwesomeIcon icon={faRightFromBracket} className='w-4 text-error' />,
      danger: true,
      key: 'Sign Out',
      label: 'Sign Out',
      className: 'toolbar-user-dropdown-item toolbar-user-dropdown-item-danger',
      onClick: desoLogout
    },
    {
      key: 'version',
      disabled: true,
      label: `Version ${process.env.REACT_APP_VERSION}`,
      className: 'toolbar-user-dropdown-item toolbar-user-dropdown-item-version'
    }
  ]

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
    <Dropdown
      className='mr-[-25px] mt-3 flex h-10 justify-end border-0 bg-transparent max-sm:mr-[-35px] max-sm:mt-[9px] max-sm:h-[35px]'
      trigger={['click']}
      menu={{
        items: dropDownItems,
        className: 'toolbar-user-dropdown-menu'
      }}
    >
      <button
        type='button'
        className='toolbar-user-trigger mt-2.5 inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-white'
      >
        {profilePic ? (
          <Image
            src={profile.profilePicUrl}
            className='!mt-[-2px] !h-[35px] !w-[35px] rounded-lg border-2 border-white/30 object-cover max-sm:!h-[25px] max-sm:!w-[25px]'
            preview={false}
          />
        ) : (
          <span className='flex h-[35px] w-[35px] items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 max-sm:h-[25px] max-sm:w-[25px]'>
            <FontAwesomeIcon icon={faUser} className='text-lg text-white' />
          </span>
        )}
        <span className='text-base font-semibold text-white max-sm:text-sm'>{profile.username}</span>
        <DownOutlined className='text-xs text-white/90' />
      </button>
    </Dropdown>
  )
}

export default ToolbarDropDown
