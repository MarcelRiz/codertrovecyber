/* eslint-disable import/no-cycle */
/* eslint-disable no-sequences */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { Package } from 'types/package'
import { RootState } from '../store'

export type PackageState = {
  packages: Package[]
  pending: boolean
  error: any
}

const initialState: PackageState = {
  packages: [],
  pending: false,
  error: null,
}

export const getPackages = createAsyncThunk(
  'packages/getPackages',
  async (input: { page: number; limit: number }) => {
    const { page = 0, limit = 10 } = input
    const offset = page * limit
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/package?offset=${offset}&limit=${limit}`
    )
    return response
  }
)

export const deletedPackage = createAsyncThunk(
  'packages/deletedPackage',
  async (payload: any) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/package/${payload.id}`,
      payload
    )
    return response
  }
)

export const updatePackage = createAsyncThunk(
  'packages/updatePackage',
  async (payload: any) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/package/${payload.id}`,
      payload
    )
    return response
  }
)

export const createPackage = createAsyncThunk(
  'packages/createPackage',
  async (payload: any) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/package`,
      payload
    )
    return response
  }
)

export const getPackage = createAsyncThunk(
  'packages/getPackage',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/package/${payload.id}`,
      payload
    )
    return response
  }
)

const PackageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    setPackages: (state, action) => {
      state.packages = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getPackages.pending, state => {
      state.pending = true
    }),
      builder.addCase(getPackages.fulfilled, (state, action) => {
        state.pending = false
        const packages = action.payload?.data.rows || []
        state.packages = packages
      }),
      builder.addCase(getPackages.rejected, state => {
        state.pending = false
      }),
      builder.addCase(deletedPackage.pending, state => {
        state.pending = true
      }),
      builder.addCase(deletedPackage.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(deletedPackage.rejected, state => {
        state.pending = false
      }),
      builder.addCase(createPackage.fulfilled, (state, action) => {
        state.pending = false
        state.packages = [...state.packages, action.payload.data]
      }),
      builder.addCase(updatePackage.fulfilled, (state, action) => {
        state.pending = false
        state.packages = state.packages.map((pack: Package) => {
          if (pack.id === action.payload.data.id) {
            pack = action.payload.data
          }
          return pack
        })
      })
  },
})
export const { setPackages } = PackageSlice.actions
export const selectPackages = (state: RootState) => state.packages
export default PackageSlice.reducer
