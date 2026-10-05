/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CoursesService from '../services/CoursesService'
import PoliciesService from '../services/PoliciesService'
import { USER_ROLE } from '../constants'

const initialState = {
  totalPolicies: 0,
  totalCourses: 0,
  assignedPolicies: 0,
  assignedCourses: 0,
}

export const getTotalCourses = createAsyncThunk(
  'dashboard/totalCourses',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const total = await CoursesService.getTotalCourses()
    const assigned = await CoursesService.getTotalAssignedCourses(user.id)
    return {
      total: total.data,
      assigned: assigned.data,
    }
  }
)

export const getTotalPolicies = createAsyncThunk(
  'dashboard/totalPolicies',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const companyId = user?.companies[0]?.id
    const isLiveOnly = user?.role?.name === USER_ROLE.STAFF
    const total = await PoliciesService.getTotalPolicies(companyId, isLiveOnly)
    const assigned = await PoliciesService.getTotalAssignedPolicies(user.id)

    return {
      total: total.data,
      assigned: assigned.data,
    }
  }
)

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: {
    [getTotalCourses.fulfilled]: (state, action) => {
      state.totalCourses = action.payload.total
      state.assignedCourses = action.payload.assigned
    },

    [getTotalPolicies.fulfilled]: (state, action) => {
      state.totalPolicies = action.payload.total
      state.assignedPolicies = action.payload.assigned
    },
  },
})

// Action creators are generated for each case reducer function
// export const { } = dashboardSlice.actions

export default dashboardSlice.reducer
