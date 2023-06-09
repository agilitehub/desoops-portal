import React from 'react'
import { Drawer, Menu, Modal, theme } from 'antd'
import { FileDoneOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import Store from '../../store'
import CoreReducer from '../utils/reducer'
import Theme from '../utils/theme'
import CoreEnums from '../utils/enums'

// Components
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LeftMenu = (props) => {
  const dispatch = useDispatch()
  const { token } = theme.useToken()
  const coreState = useSelector((state) => state.core)

  const handleSignOut = async () => {
    try {
      // To be completed
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Drawer
      title={<div style={{ color: props.secondaryLight || Theme.secondaryLight }}>{props.leftMenuTitle}</div>}
      placement='left'
      closable={true}
      width={300}
      open={props.visible}
      onClose={props.onLeftMenuClose}
      headerStyle={{
        backgroundColor: token.colorPrimary
      }}
      closeIcon={<FontAwesomeIcon icon={faClose} color='white' />}
    >
      <Menu
        onClick={(event) => {
          if (event.key === CoreEnums.tabKeys.SIGN_OUT) {
            Modal.confirm({
              title: 'Confirmation',
              content: 'Are you sure you want to sign out of the Meta-Clinic Portal?',
              okButtonProps: { style: { background: token.colorSuccess, color: 'white' } },
              cancelButtonProps: { style: { background: token.colorError, color: 'white' } },
              onOk: () => handleSignOut(),
              okText: 'Yes',
              cancelText: 'No'
            })
          } else {
            dispatch(CoreReducer.actions.menuItemClick(event))
          }
        }}
        selectedKeys={coreState.tabNavigation.activeKey}
        defaultSelectedKeys={['home']}
        mode='inline'
        defaultOpenKeys={props.expandedMenuItems}
        items={[
          ...props.menuItems(),
          Store.getState().auth.agiliteUser &&
          Store.getState().auth.agiliteUser.extraData.role === 'medical_professional'
            ? {
                key: CoreEnums.tabKeys.MY_APPOINTMENTS,
                label: (
                  <>
                    <FileDoneOutlined /> {CoreEnums.tabTitles.MY_APPOINTMENTS}
                  </>
                )
              }
            : {
                key: CoreEnums.tabKeys.MY_BOOKINGS,
                label: (
                  <>
                    <FileDoneOutlined /> {CoreEnums.tabTitles.MY_BOOKINGS}
                  </>
                )
              },
          Store.getState().auth.agiliteUser
            ? {
                key: Store.getState().auth.agiliteUser._id,
                label: (
                  <>
                    <UserOutlined /> {Store.getState().auth.agiliteUser.firstName}{' '}
                    {Store.getState().auth.agiliteUser.lastName}
                  </>
                ),
                children: [
                  {
                    key: CoreEnums.tabKeys.PERSONAL_DETAILS,
                    label: CoreEnums.tabTitles.PERSONAL_DETAILS
                  },
                  Store.getState().auth.agiliteUser.extraData.role.type === 'medical_professional'
                    ? {
                        key: 'availability',
                        label: 'Availability'
                      }
                    : undefined,
                  {
                    key: CoreEnums.tabKeys.MEDICAL_HISTORY,
                    label: CoreEnums.tabTitles.MEDICAL_HISTORY
                  },
                  {
                    key: CoreEnums.tabKeys.SIGN_OUT,
                    label: <b style={{ color: props.twitterBootstrap.danger }}>{CoreEnums.tabTitles.SIGN_OUT}</b>
                  }
                ]
              }
            : null
        ]}
      />
    </Drawer>
  )
}

export default LeftMenu
