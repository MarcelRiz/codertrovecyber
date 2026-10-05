/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type companiesState = {
  entities: any
  company: any
  companyById: any
  pending: boolean
  error: boolean
}

const initialState: companiesState = {
  entities: [],
  company: {},
  companyById: {},
  pending: false,
  error: false,
}

export const getCompanies = createAsyncThunk(
  'company/getCompanies',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/companies}`
    )
    return response
  }
)

export const getCompanyById = createAsyncThunk(
  'company/getCompanyById',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${payload.id}/summary`
    )
    return response
  }
)

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async (payload: any) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${payload.id}`,
      payload
    )
    return response
  }
)

const companySlice = createSlice({
  name: 'companny',
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.company = action.payload
    },
    resetData: (state, action) => {
      state.companyById = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.pending = false
        state.companyById = action.payload?.data || null
      })
      .addCase(updateCompany.pending, (state, action) => {
        state.pending = true
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.pending = false
        state.company = action.payload?.data || null
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.pending = false
      })
  },
})
export const { setCompany, resetData } = companySlice.actions
export const selectCompany = (state: RootState) => state.company
export default companySlice.reducer
