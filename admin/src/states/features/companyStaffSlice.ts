import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

export type companyStaffState = {
  users: any,
  pending: boolean,
  loading: boolean,
  error: any
}

const initialState: companyStaffState = {
  users: [],
  pending: false,
  loading: false,
  error: null
}

export const getStaffUsers = createAsyncThunk('companyStaff/getUsers', async (payload?: any) => {
  const { companyId } = payload
  // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role.type=staff&parents=${payload?.ids}`)
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?role.type=staff&companies_eq=${companyId}`)
  return response
})

export const updatedUser = createAsyncThunk('companyStaff/updatedUser', async (payload: any) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${payload.id}`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const deletedUser = createAsyncThunk('companyStaff/deletedUser', async (payload: any) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${payload.id}`, payload)
    return response
  }
  catch (error) {
    throw error.response.data
  }
})

export const updateUserRole = createAsyncThunk('companyStaff/updateUserRole', async (payload: any) => {
  try {
    const { roleType = "staff", userId } = payload
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/roles/${userId}`, { roleType })
    return response
  }
  catch (error) {
    throw error.response.data
  }
})

export const importStaff = createAsyncThunk('companyStaff/importStaff', async (payload: any) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    formData.append("clientId", JSON.stringify(payload.userId));
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/import-staff`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
  catch (error) {
    throw error.response.data
  }
})

function isPedingAction(action: AnyAction) {
  return action.type.startsWith('companyStaff') && action.type.endsWith('pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.startsWith('companyStaff') && action.type.endsWith('rejected')
}

const companyStaffSlice = createSlice({
  name: 'companyStaff',
  initialState,
  reducers: {
    setErrorMessage: (state, action) => {
      state.error = action?.payload?.data || ''
    },
    setUsers: (state, action) => {
      state.users = action?.payload?.data || []
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getStaffUsers.fulfilled, (state, action) => {
      state.pending = false
      let users = action.payload?.data || []
      users = users?.map(item => {
        return {
          ...item,
          companyName: item.companies?.length > 0 && item.companies[0].name || 0,
          name: `${item.firstName || ''} ${item.lastName || ''}`
        }
      })
      state.users = users
    })
      .addCase(updatedUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.map(item => {
          if (item?.id === action?.payload?.data?.id) {
            return {
              ...item,
              ...action?.payload?.data,
              name: `${action?.payload?.data?.firstName} ${action?.payload?.data?.lastName}`
            }
          }
          return item
        })
      })
      .addCase(deletedUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user.id !== action?.payload?.data?.id)
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(importStaff.fulfilled, (state, action) => {
        state.loading = false
      }).addMatcher(
        isPedingAction,
        (state, action) => {
          if(action.type === 'companyStaff/getUsers/pending') {
            state.pending = true
          } else {
            state.loading = true
          }
        }
      ).addMatcher(
        isRejectedAction,
        (state, action) => {
          state.pending = false
          state.loading = false
          if (typeof action.error.message === 'string') {
            state.error = action.error.message
          } else {
            state.error = 'Oops, something has gone wrong'
          }
        }
      )
  }
})

export const { setErrorMessage, setUsers } = companyStaffSlice.actions
export const selectCompanyStaff = (state: RootState) => state.companyStaff
export default companyStaffSlice.reducer
