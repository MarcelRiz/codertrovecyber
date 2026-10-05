/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FileService from '../services/fileService'

const initialState = {
  currentFile: {} || [],
  pending: false,
  error: null,
}

export const getFile = createAsyncThunk(
  'fileManagement/getFile',
  async payload => {
    try {
      const body = {
        pathName: payload.pathName || [],
      }

      const response = await FileService.getFile(body)
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

const fileManagementSlice = createSlice({
  name: 'fileManagement',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getFile.pending, state => {
      state.pending = true
    })
    builder.addCase(getFile.fulfilled, (state, action) => {
      state.pending = false
      const currentFileValue = action.payload?.data
      state.currentFile = {
        ...state.currentFile,
        [currentFileValue.pathName]: currentFileValue.preSignedUrl,
      }
    })
    builder.addCase(getFile.rejected, state => {
      state.pending = false
    })
  },
})

export default fileManagementSlice.reducer
