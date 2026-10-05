import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type userManagementState = {
  users: any
  pending: boolean
  error: any
}

const initialState: userManagementState = {
  users: [],
  pending: false,
  error: null,
}

export const getUsers = createAsyncThunk(
  'userManagement/getUsers',
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users?role.type=client`
    )
    return response
  }
)

export const deletedUser = createAsyncThunk(
  'userManagement/deletedUser',
  async (payload: any) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${payload.id}`,
      payload
    )
    return response
  }
)

export const changeBlockStatus = createAsyncThunk(
  'userManagement/changeBlockStatus',
  async (payload: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/change-block-status`,
        payload
      )
      return response
    } catch (error) {
      throw error.response.data
    }
  }
)

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    updateUserStatus: (state, action) => {
      state.users = state.users.map(item => {
        if (action.payload.id === item.id) {
          return {
            ...item,
            blocked: !item.blocked,
          }
        }
        return item
      })
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => {
        state.pending = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.pending = false
        let users = action.payload?.data || []
        users = users?.map(item => ({
          ...item,
          companyName:
            (item.companies?.length > 0 && item.companies[0].name) || 0,
          name: `${item.firstName || ''} ${item.lastName || ''}`,
        }))
        state.users = users
      })
      .addCase(getUsers.rejected, state => {
        state.pending = false
      })
      .addCase(deletedUser.pending, state => {
        state.pending = true
      })
      .addCase(deletedUser.fulfilled, (state, action) => {
        state.pending = false
        state.users = state.users.filter(
          user => user.id !== action?.payload?.data?.id
        )
      })
      .addCase(deletedUser.rejected, state => {
        state.pending = false
      })
  },
})
export const { updateUserStatus } = userManagementSlice.actions
export const selectUserManagement = (state: RootState) => state.userManagement
export default userManagementSlice.reducer
