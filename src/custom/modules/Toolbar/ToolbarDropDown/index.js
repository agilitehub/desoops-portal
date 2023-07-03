import React from 'react'
import { useSelector } from 'react-redux'
import { Dropdown, Modal, Space, theme } from 'antd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faUser } from '@fortawesome/free-solid-svg-icons'

const ToolbarDropDown = () => {
  const state = useSelector((state) => state.auth)
  const { token } = theme.useToken()

  const handleGetItems = () => {
    const dropDownItems = {
      personalDetails: {
        key: 'Personal Details',
        label: 'Personal Details'
      },
      signOut: {
        danger: true,
        key: 'Sign Out',
        label: 'Sign Out',
        onClick: () => {
          Modal.confirm({
            title: 'Confirmation',
            content: 'Are you sure you want to Sign Out of the Meta-Clinic Portal',
            okButtonProps: { style: { background: token.colorSuccess, color: 'white' } },
            cancelButtonProps: { style: { background: token.colorError, color: 'white' } },
            okText: 'Yes',
            cancelText: 'No'
          })
        }
      },
      dependants: {
        key: 'Dependants',
        label: 'Dependants'
      },
      version: {
        key: 'version',
        disabled: true,
        label: <small>Version {process.env.REACT_APP_VERSION}</small>
      }
    }

    return [dropDownItems.personalDetails, dropDownItems.dependants, dropDownItems.signOut, dropDownItems.version]
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
          <span>John Jardin</span>
        </Space>
      </Dropdown>
    </>
  )
}

export default ToolbarDropDown
