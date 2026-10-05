import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type userProfileState = {
  user: any
  pending: boolean
  error: any
}

const initialState: userProfileState = {
  user: {},
  pending: false,
  error: null,
}

export const getUser = createAsyncThunk(
  'userManagement/getUser',
  async (payload: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${payload.id}`
    )
    return response
  }
)

export const putUser = createAsyncThunk(
  'userManagement/putUser',
  async (payload: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${payload.id}`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

export const createUser = createAsyncThunk(
  'userManagement/createUser',
  async (payload: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/local/register-client`,
        payload
      )
      return response
    } catch (err) {
      throw err.response.data
    }
  }
)

const userPofileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getUser.pending, state => {
      state.pending = true
    }),
      builder.addCase(getUser.fulfilled, (state, action) => {
        state.pending = false
        state.user = action.payload?.data || null
      }),
      builder.addCase(getUser.rejected, state => {
        state.pending = false
      }),
      builder.addCase(putUser.pending, state => {
        state.pending = true
      }),
      builder.addCase(putUser.fulfilled, (state, action) => {
        state.pending = false
        state.user = action.payload?.data || null
      }),
      builder.addCase(putUser.rejected, (state, action) => {
        state.pending = false
        if (typeof action.error.message === 'string') {
          state.error = action.error.message
        } else {
          state.error = 'Oops, something has gone wrong'
        }
      }),
      builder.addCase(createUser.pending, state => {
        state.pending = true
      }),
      builder.addCase(createUser.fulfilled, state => {
        state.pending = false
      }),
      builder.addCase(createUser.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      })
  },
})
export const { setError } = userPofileSlice.actions
export const selectUserPofile = (state: RootState) => state.userPofile
export default userPofileSlice.reducer
