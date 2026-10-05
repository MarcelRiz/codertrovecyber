import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type dashboardState = {
  data: any
  pending: boolean
  error: boolean
}

const initialState: dashboardState = {
  data: {
    clients: 0,
    staff: 0,
    courses: 0,
    policies: 0,
    rating: 0.2,
  },
  pending: false,
  error: false,
}

export const getInfo = createAsyncThunk('dashboard/getInfo', async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin-zone/dashboard-summary`
  )
  return response.data
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: builder => {
    builder.addCase(getInfo.fulfilled, (state, action) => {
      state.data = action.payload
    })
  },
})
export const selectDashboard = (state: RootState) => state.dashboard
export default dashboardSlice.reducer
