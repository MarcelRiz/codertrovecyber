/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { SortByFields } from '../../utilities/helps'
import { RootState } from '../store'

export type industryState = {
  entities: any
  industry: any
  pending: boolean
  error: boolean
}

const initialState: industryState = {
  entities: [],
  industry: {},
  pending: false,
  error: false,
}

export const getIndustries = createAsyncThunk(
  'industry/getIndustries',
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/industries`
    )
    return response
  }
)

export const updateindustry = createAsyncThunk(
  'industry/updateindustry',
  async (payload: any) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/industries/${payload.id}`,
      payload
    )
    return response
  }
)

const industrySlice = createSlice({
  name: 'industry',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getIndustries.pending, (state, _action) => {
        state.pending = true
      })
      .addCase(getIndustries.fulfilled, (state, action) => {
        state.pending = false
        let data = action.payload?.data
        if (data?.length > 0) {
          data = SortByFields(data, 'name')
          state.entities = data
        }
      })
      .addCase(getIndustries.rejected, (state, _action) => {
        state.pending = false
      })
  },
})

export const selectIndustry = (state: RootState) => state.industry
export default industrySlice.reducer
