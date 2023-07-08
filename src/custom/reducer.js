import { createSlice } from '@reduxjs/toolkit'
import { customState } from './state'

const slice = createSlice({
  name: 'custom',
  initialState: customState(),
  reducers: {
    resetState: (state) => {
      state = customState()
    },
    setDeSoData: (state, data) => {
      state.desoData = data.payload
    },
    updateFollowers: (state, data) => {
      state.desoData.profile.followers = data.payload.data
      state.desoData.fetchedFollowers = true
    },
    updateFollowing: (state, data) => {
      state.desoData.profile.following = data.payload.data
      state.desoData.fetchedFollowing = true
    }
  }
})

export const { resetState, setDeSoData, updateFollowers, updateFollowing } = slice.actions
export default slice.reducer
