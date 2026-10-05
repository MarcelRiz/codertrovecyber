/* eslint-disable no-unused-vars */
import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type fileState = {
  file: any
  pendingUpload: boolean
  errorFile: string
}

const initialState: fileState = {
  file: {},
  pendingUpload: false,
  errorFile: null,
}

export const addFile = createAsyncThunk(
  'file/addFile',
  async (payload: any) => {
    const formData = new FormData()
    formData.append('files', payload.file)
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response
  }
)

export const deleteFile = createAsyncThunk(
  'file/deleteFile',
  async (payload: any) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/upload/${payload?.id}`
    )
    return response
  }
)

function isPedingAction(action: AnyAction) {
  return action.type.startsWith('file') && action.type.endsWith('pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.startsWith('file') && action.type.endsWith('rejected')
}

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addFile.fulfilled, (state, action) => {
        state.pendingUpload = false
        state.file = action.payload?.data[0] || null
      })
      .addCase(addFile.rejected, (state, action) => {
        state.pendingUpload = false
      })
      .addMatcher(isPedingAction, (state, action) => {
        state.pendingUpload = true
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.pendingUpload = false
        if (typeof action.error.message === 'string') {
          state.errorFile = action.error.message
        } else {
          state.errorFile = 'Oops, something has gone wrong'
        }
      })
  },
})
export const selectfile = (state: RootState) => state.file
export default fileSlice.reducer
