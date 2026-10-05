/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type uploadFileManagementState = {
  currentFile: any
  signatureCreateFile: any
  isUploadedFile: boolean
  isSubmitFile: boolean
  pending: boolean
  error: boolean
}

const initialState: uploadFileManagementState = {
  currentFile: {} || [],
  signatureCreateFile: {} || [],
  isUploadedFile: false,
  isSubmitFile: false,
  pending: false,
  error: null,
}

export const getFile = createAsyncThunk(
  'uploadFileManagement/getFile',
  async (payload: any) => {
    try {
      const body: any = {
        pathName: [payload.pathName] || [],
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/file-google-storages/getFile`,
        body
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const getSignatureCreateFile = createAsyncThunk(
  'uploadFileManagement/getSignatureCreateFile',
  async (payload: any) => {
    try {
      const body: any = {
        fileName: [payload.fileName] || [],
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/file-google-storages/getSignatureCreateFile`,
        body
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const removeFile = createAsyncThunk(
  'uploadFileManagement/removeFile',
  async (payload: any) => {
    try {
      const body: any = {
        pathName: [payload.pathName] || [],
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/file-google-storages/removeFile`,
        body
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const uploadFileToGCS = createAsyncThunk(
  'uploadFileManagement/uploadFileToGCS',
  async (payload: any) => {
    try {
      const { preSignedUrl, dataFile } = payload
      const response = await axios.put(preSignedUrl, dataFile)
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

const uploadFileManagementSlice = createSlice({
  name: 'uploadFileManagement',
  initialState,
  reducers: {
    setIsUploadedFile: (state, action) => {
      state.isUploadedFile = action.payload || false
    },
    setIsSubmitFile: (state, action) => {
      state.isSubmitFile = action.payload
    },
    resetStore: (state, action) => {
      if (action.payload) {
        ;(state.currentFile = {} || []),
          (state.signatureCreateFile = {} || []),
          (state.isUploadedFile = false),
          (state.isSubmitFile = false),
          (state.pending = false),
          (state.error = null)
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(getFile.pending, state => {
      state.pending = true
    }),
      builder.addCase(getFile.fulfilled, (state, action) => {
        state.pending = false
        const currentFileValue = action.payload?.data
        state.currentFile = currentFileValue
      }),
      builder.addCase(getFile.rejected, state => {
        state.pending = false
      }),
      builder.addCase(getSignatureCreateFile.pending, state => {
        state.pending = true
      }),
      builder.addCase(getSignatureCreateFile.fulfilled, (state, action) => {
        state.pending = false
        const signatureCreateFileValue = action.payload?.data
        state.signatureCreateFile = signatureCreateFileValue
      }),
      builder.addCase(getSignatureCreateFile.rejected, state => {
        state.pending = false
      }),
      builder.addCase(removeFile.pending, state => {
        state.pending = true
      }),
      builder.addCase(removeFile.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(removeFile.rejected, state => {
        state.pending = false
      })

    builder.addCase(uploadFileToGCS.pending, state => {
      state.isUploadedFile = false
    }),
      builder.addCase(uploadFileToGCS.fulfilled, state => {
        state.isUploadedFile = true
      }),
      builder.addCase(uploadFileToGCS.rejected, state => {
        state.isUploadedFile = false
      })
  },
})

export const { setIsUploadedFile, resetStore, setIsSubmitFile } =
  uploadFileManagementSlice.actions
export const selectUploadFileManagement = (state: RootState) =>
  state.uploadFileManagement
export default uploadFileManagementSlice.reducer
