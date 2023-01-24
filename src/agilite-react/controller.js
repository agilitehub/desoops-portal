import State from './state'
import Store from '../store'
import AgiliteReactEnums from './resources/enums'
import { generateContent } from '../agilite-react-setup'

export const handleMenuItemClick = (event) => {
  const payload = generateContent(event.key)
  Store.dispatch({ type: AgiliteReactEnums.reducers.MENU_ITEM_CLICK, payload })
}

export const handleMenuAction = (action) => {
  switch (action) {
    case 'open':
      Store.dispatch({ type: AgiliteReactEnums.reducers.LEFT_MENU_OPEN })
      break
    case 'close':
      Store.dispatch({ type: AgiliteReactEnums.reducers.LEFT_MENU_CLOSE })
      break
    default:
  }
}

export const handleTabAction = (action, key) => {
  switch (action) {
    case 'change':
      Store.dispatch({ type: AgiliteReactEnums.reducers.CHANGE_TAB, key })
      break
    case 'close':
      Store.dispatch({ type: AgiliteReactEnums.reducers.CLOSE_TAB, key })
      break
    default:
  }
}

export const addTab = (activeKey, tab, state) => {
  let tabExists = false
  let result = null

  for (const tmpEntry of state.tabNavigation.tabs) {
    if (tmpEntry.key === activeKey) {
      tabExists = true
      break
    }
  }

  if (tabExists) {
    result = {
      ...state,
      tabNavigation: { ...state.tabNavigation, activeKey },
      leftMenu: {
        ...state.leftMenu,
        visible: false
      },
      rightMenu: {
        ...state.rightMenu,
        visible: false
      }
    }
  } else {
    state.tabNavigation.tabs.push(tab)

    result = {
      ...state,
      tabNavigation: { ...state.tabNavigation, activeKey, tabs: state.tabNavigation.tabs },
      leftMenu: {
        ...state.leftMenu,
        visible: false
      },
      rightMenu: {
        ...state.rightMenu,
        visible: false
      }
    }
  }

  return result
}

export const closeTab = (tabs, targetKey) => {
  let tmpTabs = tabs
  let tmpActiveKey = null

  tmpTabs = tmpTabs.filter((tab) => tab.key !== targetKey)
  tmpActiveKey = tmpTabs.length > 0 ? tmpTabs[tmpTabs.length - 1].key : State.tabNavigation.rootTabKey

  return { tabs: tmpTabs, activeKey: tmpActiveKey }
}

export const loadContent = (payload, state) => {
  if (state.tabNavigation.enabled) {
    return addTab(payload.key, payload, state)
  } else {
    return {
      ...state,
      leftMenu: {
        ...state.leftMenu,
        visible: false
      },
      rightMenu: {
        ...state.rightMenu,
        visible: false
      },
      rootContent: () => payload.content
    }
  }
}
