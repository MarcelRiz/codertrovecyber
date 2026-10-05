/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showProfileModal: false,
  showEditProfileModal: false,
  showChangePasswordModal: false,
  showSupportCentreModal: false,
  showAssistanceRequestModal: false,
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    toggleProfileModal: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.showProfileModal = action.payload
    },
    toggleEditProfileModal: (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.showEditProfileModal = action.payload
    },
    toggleChangePasswordModal: (state, action) => {
      state.showChangePasswordModal = action.payload
    },
    toggleChangeSupportCentreModal: (state, action) => {
      state.showSupportCentreModal = action.payload
    },
    toggleChangeAssistanceRequestModal: (state, action) => {
      state.showAssistanceRequestModal = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  toggleProfileModal,
  toggleEditProfileModal,
  toggleChangePasswordModal,
  toggleChangeSupportCentreModal,
  toggleChangeAssistanceRequestModal,
} = commonSlice.actions

export default commonSlice.reducer
