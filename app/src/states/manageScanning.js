/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ManageScanningService from '../services/ManageScanningService'

const initialState = {
  pending: false,
  scanningList: [],
  scanningListLoading: false,
}

export const getScanningList = createAsyncThunk(
  'manageScanning/getScanningList',
  async payload => {
    try {
      const response = await ManageScanningService.getScanningList({
        ownerOfScanner: payload.ownerOfScanner,
      })
      return response.data
    } catch (err) {
      throw err.response.data
    }
  }
)

const manageScanningSlice = createSlice({
  name: 'manageScanning',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // getScanningList
    builder.addCase(getScanningList.pending, state => {
      state.pending = true
      state.scanningListLoading = true
      state.scanningList = []
    })
    builder.addCase(getScanningList.fulfilled, (state, action) => {
      state.pending = false
      state.scanningListLoading = false
      state.scanningList = action.payload
    })
    builder.addCase(getScanningList.rejected, state => {
      state.pending = false
      state.scanningListLoading = false
      state.scanningList = []
    })
  },
})

export default manageScanningSlice.reducer
