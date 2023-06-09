import Store from '../../store'
import { coreState } from './core-state'
import coreReducer from './reducer'
import CoreEnums from './enums'

export const handleMenuItemClick = (event) => {
  return null
}

export const handleMenuAction = (menu) => {
  switch (menu) {
    case CoreEnums.menuActions.LEFT:
      Store.dispatch(coreReducer.actions.leftMenuOpenClose())
      break
    case CoreEnums.menuActions.RIGHT:
      Store.dispatch(coreReducer.actions.rightMenuOpenClose())
      break
  }
}

export const handleTabAction = (action, key) => {
  switch (action) {
    case CoreEnums.tabActions.CHANGE:
      Store.dispatch(coreReducer.actions.changeTab(key))
      break
    case CoreEnums.tabActions.CLOSE:
      Store.dispatch(coreReducer.actions.closeTab({ targetKey: key, removeBreadcrumb: true }))
      break
    default:
  }
}

export const addTab = (tab, state, currentState) => {
  const breadcrumbState = currentState.breadcrumbs
  let tmpBreadcrumbState = breadcrumbState.concat()
  let tabExists = false

  for (const tmpEntry of currentState.tabNavigation.tabs) {
    if (tmpEntry.key === tab.key) {
      tabExists = true
      break
    }
  }

  if (currentState.tabNavigation.rootTabKey === tab.key) {
    tabExists = true
  }

  if (tmpBreadcrumbState.length >= 2 && tmpBreadcrumbState[tmpBreadcrumbState.length - 2].key === tab.key) {
    tmpBreadcrumbState.pop()
    closeTab(state, currentState, { targetKey: currentState.tabNavigation.activeKey })
  } else {
    tmpBreadcrumbState.push({ key: tab.key, label: tab.label })
  }

  if (tabExists) {
    if (currentState.tabNavigation.activeKey !== tab.key) {
      state.breadcrumbs = tmpBreadcrumbState
    }

    state.tabNavigation.activeKey = tab.key
    state.leftMenu.visible = false
    state.rightMenu.visible = false
  } else {
    state.breadcrumbs = tmpBreadcrumbState
    state.tabNavigation.tabs.push(tab)
    state.tabNavigation.activeKey = tab.key
    state.leftMenu.visible = false
    state.rightMenu.visible = false
  }
}

export const closeTab = (state, currentState, payload) => {
  let tmpBreadcrumbState = currentState.breadcrumbs.concat()
  let tmpTabs = currentState.tabNavigation.tabs
  let tmpActiveKey = null

  tmpTabs = tmpTabs.filter((tab) => tab.key !== payload.targetKey)

  if (payload.newTabKey) {
    tmpActiveKey = payload.newTabKey
  } else {
    state.tabNavigation.lastActiveKey = state.tabNavigation.lastActiveKey.filter((key) => key !== payload.targetKey)
    tmpActiveKey =
      state.tabNavigation.lastActiveKey.length > 0
        ? state.tabNavigation.lastActiveKey[state.tabNavigation.lastActiveKey.length - 1]
        : coreState().tabNavigation.rootTabKey
  }

  if (payload.removeBreadcrumb) {
    tmpBreadcrumbState.splice(
      tmpBreadcrumbState.findIndex((bc) => bc.key === payload.targetKey),
      1
    )
    state.breadcrumbs = tmpBreadcrumbState
  }

  state.tabNavigation.tabs = tmpTabs
  state.tabNavigation.activeKey = tmpActiveKey
}

export const loadContent = (payload, state, currentState) => {
  if (currentState.tabNavigation.enabled) {
    return addTab(payload, state, currentState)
  } else {
    // Default root content to content that needs to be loaded
    state.leftMenu.visible = false
    state.rightMenu.visible = false
    state.rootContent = () => payload.children
  }
}
