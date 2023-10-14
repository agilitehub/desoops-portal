import Theme from './theme'
import App from 'app'

export const coreState = () => {
  return {
    title: process.env.REACT_APP_NAME,
    rootContent: App,
    theme: Theme,
    leftMenu: {
      leftMenuTitle: '',
      leftMenuEnabled: false,
      menuItems: () => null,
      visible: false,
      onLeftMenuOpen: () => {},
      onLeftMenuClose: () => {},
      expandedMenuItems: []
    },
    rightMenu: {
      rightMenuTitle: '',
      rightMenuEnabled: false,
      menuItems: () => null,
      visible: false,
      onRightMenuOpen: () => {},
      onRightMenuClose: () => {},
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
      onTabChange: (key) => {},
      onTabClose: (key) => {}
    },
    breadcrumbs: [],
    editedTabs: []
  }
}
