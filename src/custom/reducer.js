import { createSlice } from '@reduxjs/toolkit'
import { customState } from './state'

const initialState = customState()

const slice = createSlice({
  name: 'custom',
  initialState,
  reducers: {
    resetState: () => initialState,
    setDeSoData: (state, data) => {
      state.desoData = data.payload
    },
    setAgiliteData: (state, data) => {
      state.agiliteData = data.payload
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
      state.isMobile = data.payload.isMobile
      state.isTablet = data.payload.isTablet
    }
  }
})

export const { resetState, setDeSoData, setAgiliteData, updateFollowers, updateFollowing, setDeviceType } =
  slice.actions
export default slice.reducer
