/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkins: [],
  showCheckinModal: false,
}

export const checkinsSlice = createSlice({
  name: 'checkins',
  initialState,
  reducers: {
    setCheckins: (state, action) => {
      state.checkins = action.payload
    },
    openCheckinModal: state => {
      state.showCheckinModal = true
    },
    closeCheckinModal: state => {
      state.showCheckinModal = false
    },
  },
})

export const { setCheckins, openCheckinModal, closeCheckinModal } =
  checkinsSlice.actions

export default checkinsSlice.reducer
