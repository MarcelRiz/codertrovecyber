import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import { RootState } from '../store'

export type manageScanningManagementState = {
  scanningList: any
  pending: boolean
  error: any
  editingScan: any
}

const initialState: manageScanningManagementState = {
  scanningList: [],
  editingScan: {},
  pending: false,
  error: null,
}

export const getScanningList = createAsyncThunk(
  'manageScanningManagement/getScanningList',
  async (payload: any) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/manage-scanning?ownerOfScanner=${payload.userId}`
      )
      return response
    } catch (error) {
      return error.response.data
    }
  }
)

export const deletedScanning = createAsyncThunk(
  'manageScanningManagement/deletedScanning',
  async (payload: any) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/manage-scanning/${payload.id}`
      )
      return response
    } catch (error) {
      toast.error(error.response.data.message)
      return error.response.data
    }
  }
)

export const updateScanning = createAsyncThunk(
  'manageScanningManagement/updateScanning',
  async (payload: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/manage-scanning/${payload.id}`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const createScanning = createAsyncThunk(
  'manageScanningManagement/createScanning',
  async (payload: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/manage-scanning`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

const manageScanningManagementSlice = createSlice({
  name: 'manageScanningManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // getScanningList
    builder.addCase(getScanningList.pending, state => {
      state.pending = true
    }),
      builder.addCase(getScanningList.fulfilled, (state, action) => {
        state.pending = false
        state.scanningList = action.payload?.data || []
      }),
      builder.addCase(getScanningList.rejected, state => {
        state.pending = false
      }),
      // deletedScanning
      builder.addCase(deletedScanning.pending, state => {
        state.pending = true
      }),
      builder.addCase(deletedScanning.fulfilled, (state, action) => {
        state.pending = false
        state.scanningList = state.scanningList.filter(
          scanItem => scanItem.id !== action?.payload?.data?.id
        )
      }),
      builder.addCase(deletedScanning.rejected, state => {
        state.pending = false
      }),
      // createScanning
      builder.addCase(createScanning.pending, state => {
        state.pending = true
      }),
      builder.addCase(createScanning.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(createScanning.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      })
    // updateScanning
    builder.addCase(updateScanning.pending, state => {
      state.pending = true
    }),
      builder.addCase(updateScanning.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(updateScanning.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      })
  },
})
export const selectManageScanningManagement = (state: RootState) =>
  state.manageScanningManagement
export default manageScanningManagementSlice.reducer
