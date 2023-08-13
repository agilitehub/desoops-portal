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
  setDeSoPrice
} = slice.actions
export default slice.reducer
