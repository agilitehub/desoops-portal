import { createSlice } from '@reduxjs/toolkit'
import { customState } from './state'

const initialState = customState()

const slice = createSlice({
  name: 'custom',
  initialState,
  reducers: {
    resetState: (state) => {
      state.desoData = initialState.desoData
      state.configData = initialState.configData
    },
    setDeSoData: (state, data) => {
      state.desoData = data.payload
    },
    setDeSoPrice: (state, data) => {
      state.desoData.desoPrice = data.payload
    },
    /**
     * Updates DESO/USD, Focus/DESO book mid, Focus/USD, and wallet USD labels derived from cached balances.
     */
    setMarketPrices: (state, data) => {
      const { desoPrice, focusPriceDeso, focusPriceUsd } = data.payload
      state.desoData.desoPrice = desoPrice
      state.desoData.focusPriceDeso = focusPriceDeso
      state.desoData.focusPriceUsd = focusPriceUsd
      const desoBal = state.desoData.profile.desoBalance || 0
      const focusBal = state.desoData.profile.focusBalance || 0
      state.desoData.profile.desoBalanceUSD = Math.floor(desoBal * desoPrice * 100) / 100
      state.desoData.profile.focusBalanceUSD =
        focusPriceUsd > 0 ? Math.floor(focusBal * focusPriceUsd * 100) / 100 : 0
    },
    setDiamondLevels: (state, data) => {
      state.desoData.setDiamondLevels = data.payload
    },
    setConfigData: (state, data) => {
      state.configData = data.payload
    },
    setDistributionTemplates: (state, data) => {
      state.distributionTemplates = data.payload
    },
    updateFollowers: (state, data) => {
      state.desoData.profile.followers = data.payload.data
      state.desoData.fetchedFollowers = true
    },
    updateFollowing: (state, data) => {
      state.desoData.profile.following = data.payload.data
      state.desoData.fetchedFollowing = true
    },
    setDeviceType: (state, data) => {
      state.userAgent.isMobile = data.payload.isMobile
      state.userAgent.isTablet = data.payload.isTablet
      state.userAgent.isSmartphone = data.payload.isSmartphone
    },
    setLeftMenu: (state, data) => {
      state.leftMenu = data.payload
    },
    setEditProfileVisible: (state, data) => {
      state.editProfileVisible = data.payload
    },
    setEditNotificationsVisible: (state, data) => {
      state.editNotificationsVisible = data.payload
    },
    setNotificationsVisible: (state, data) => {
      state.notificationsVisible = data.payload
    },
    setComingSoon: (state, data) => {
      state.comingSoon = data.payload
    },
    setUnreadCount: (state, data) => {
      state.unreadCount = data.payload
    },
    setNotifications: (state, data) => {
      state.configData.notifications = data.payload
    }
  }
})

export const {
  resetState,
  setDeSoData,
  setConfigData,
  setDistributionTemplates,
  updateFollowers,
  updateFollowing,
  setDeviceType,
  setLeftMenu,
  setDeSoPrice,
  setMarketPrices,
  setDiamondLevels,
  setEditProfileVisible,
  setComingSoon,
  setEditNotificationsVisible,
  setUnreadCount,
  setNotifications,
  setNotificationsVisible
} = slice.actions

export default slice.reducer
