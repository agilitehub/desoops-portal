import Theme from './theme'

import { handleMenuAction, handleTabAction } from './controller'
import CoreEnums from './enums'
import App from '../../custom/app'

export const coreState = () => {
  return {
    title: process.env.REACT_APP_NAME,
    rootContent: App,
    theme: Theme,
    leftMenu: {
      leftMenuTitle: CoreEnums.menuTitles.LEFT_MENU,
      leftMenuEnabled: false,
      menuItems: () => null,
      visible: false,
      onLeftMenuOpen: () => handleMenuAction(CoreEnums.menuActions.LEFT),
      onLeftMenuClose: () => handleMenuAction(CoreEnums.menuActions.LEFT),
      expandedMenuItems: []
    },
    rightMenu: {
      rightMenuTitle: CoreEnums.menuTitles.RIGHT_MENU,
      rightMenuEnabled: false,
      menuItems: () => null,
      visible: false,
      onRightMenuOpen: () => handleMenuAction(CoreEnums.menuActions.RIGHT),
      onRightMenuClose: () => handleMenuAction(CoreEnums.menuActions.RIGHT),
      expandedMenuItems: []
    },
    toolbar: {
      enabled: false,
      title: process.env.REACT_APP_NAME,
      customMenus: {
        content: null
      }
    },
    tabNavigation: {
      enabled: false,
      hidden: true,
      rootTabKey: 'home',
      rootTabTitle: 'Home',
      activeKey: 'home',
      lastActiveKey: [],
      animated: true,
      tabs: [],
      onTabChange: (key) => handleTabAction(CoreEnums.tabActions.CHANGE, key),
      onTabClose: (key) => handleTabAction(CoreEnums.tabActions.CLOSE, key)
    },
    breadcrumbs: [],
    editedTabs: []
  }
}
