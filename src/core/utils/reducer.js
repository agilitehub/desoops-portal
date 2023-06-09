import { createSlice, current } from '@reduxjs/toolkit'
import { coreState } from './core-state'
import { closeTab, handleMenuItemClick, loadContent } from './controller'

const coreReducer = createSlice({
  name: 'core',
  initialState: coreState(),
  reducers: {
    resetState: (state) => {
      state = coreState()
    },
    addTab: (state, action) => {
      state.tabNavigation.lastActiveKey.push(state.tabNavigation.activeKey)
      loadContent(action.payload, state, current(state))
    },
    menuItemClick: (state, action) => {
      state.tabNavigation.lastActiveKey.push(state.tabNavigation.activeKey)
      loadContent(handleMenuItemClick(action.payload, state.tabNavigation.activeKey), state, current(state))
    },
    changeTab: (state, action) => {
      state.tabNavigation.lastActiveKey.push(state.tabNavigation.activeKey)
      state.tabNavigation.activeKey = action.payload
    },
    closeTab: (state, action) => {
      closeTab(state, current(state), action.payload)
    },
    enableDisableToolbar: (state, action) => {
      state.toolbar.enabled = action.payload
    },
    enableDisableTabs: (state, action) => {
      state.tabNavigation.enabled = action.payload
    },
    hideTabs: (state, action) => {
      state.tabNavigation.hidden = action.payload
    },
    enableDisableLeftMenu: (state, action) => {
      state.leftMenu.leftMenuEnabled = action.payload
    },
    enableDisableRightMenu: (state, action) => {
      state.rightMenu.rightMenuEnabled = action.payload
    },
    leftMenuOpenClose: (state) => {
      state.leftMenu.visible = !state.leftMenu.visible
    },
    rightMenuOpenClose: (state) => {
      state.rightMenu.visible = !state.rightMenu.visible
    },
    setRootContent: (state, action) => {
      state.rootContent = action.payload
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    }
  }
})

export default coreReducer
