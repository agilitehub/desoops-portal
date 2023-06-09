import React from 'react'
import { Drawer, Menu, theme } from 'antd'

import Store from '../../store'
import coreReducer from '../utils/reducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

const RightMenu = (props) => {
  const { token } = theme.useToken()
  return (
    <Drawer
      title={<div style={{ color: props.secondaryLight }}>{props.rightMenuTitle}</div>}
      placement='right'
      closable={true}
      closeIcon={<FontAwesomeIcon icon={faClose} color='white' />}
      width={310}
      open={props.visible}
      onClose={props.onRightMenuClose}
      headerStyle={{
        backgroundColor: token.colorPrimary,
        color: 'white'
      }}
    >
      <Menu
        onClick={(event) => Store.dispatch(coreReducer.actions.menuItemClick(event))}
        mode='inline'
        defaultOpenKeys={props.expandedMenuItems}
        items={[...props.menuItems()]}
      />
    </Drawer>
  )
}

export default RightMenu
