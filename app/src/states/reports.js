/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ReportsService from '../services/ReportsService'

const initialState = {
  reports: [],
  reportTypes: [],
  gettingReports: false,
}

export const getReportTypes = createAsyncThunk(
  'reports/reportTypes',
  async () => {
    const response = await ReportsService.getReportTypes()
    return response.data
  }
)

export const getReports = createAsyncThunk(
  'reports/reports',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const response = await ReportsService.getReports(user.id)
    return response.data
  }
)

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: {
    [getReportTypes.pending]: state => {
      state.reportTypes = []
    },
    [getReportTypes.fulfilled]: (state, action) => {
      state.reportTypes = action.payload
    },
    [getReportTypes.rejected]: state => {
      state.reportTypes = []
    },
    [getReports.pending]: state => {
      state.reports = []
      state.gettingReports = true
    },
    [getReports.fulfilled]: (state, action) => {
      state.reports = action.payload
      state.gettingReports = false
    },
    [getReports.rejected]: state => {
      state.reports = []
      state.gettingReports = false
    },
  },
})

// export const {} = reportsSlice.actions

export default reportsSlice.reducer
