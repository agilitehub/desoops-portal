import React from 'react'
import { Dropdown, Space } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons'

import { desoLogout } from '../../../lib/deso-controller'

const ToolbarDropDown = () => {
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
        <Space style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faChevronDown} style={{ cursor: 'pointer' }} />
          <FontAwesomeIcon icon={faUser} style={{ cursor: 'pointer' }} />
          <span>DeSo Username</span>
        </Space>
      </Dropdown>
    </>
  )
}

export default ToolbarDropDown
