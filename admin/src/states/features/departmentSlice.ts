import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

interface departmentDetail {
  id: number,
  name: string,
  key: number,
}

export type departmentManagementState = {
  departments: departmentDetail[],
  pending: boolean
  error: boolean
}

const initialState: departmentManagementState = {
  departments: [],
  pending: false,
  error: false
}

export const getDepartments = createAsyncThunk('departmentManagement/getDepartments', async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/departments`)
  return response
})

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDepartments.pending, (state) => {
      state.pending = true
    }),
    builder.addCase(getDepartments.fulfilled, (state, action) => {
      state.pending = false
      state.departments = action.payload?.data || []
    }),
    builder.addCase(getDepartments.rejected, (state) => {
      state.pending = false
    })
  }
})

export const selectDepartment = (state: RootState) => state.department
export default departmentSlice.reducer
