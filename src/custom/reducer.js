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
    }
  }
})

export const { resetState, setDeSoData } = slice.actions
export default slice.reducer
