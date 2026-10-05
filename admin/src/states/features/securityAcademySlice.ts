import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"
import { RootState } from "../store"

export type securityAcademyState = {
  securityAcademy: any,
  pending: boolean,
  error: any
}

const initialState: securityAcademyState = {
  securityAcademy: [],
  pending: false,
  error: null
}

export const questionGroups = createAsyncThunk('securityAcademy/questionGroups', async (payload: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}​/question-groups/user-response`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})
function isPedingAction(action: AnyAction) {
  return action.type.startsWith('securityAcademy') && action.type.endsWith('pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.startsWith('securityAcademy') && action.type.endsWith('rejected')
}


const securityAcademySlice = createSlice({
  name: 'securityAcademy',
  initialState,
  reducers: {    
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(questionGroups.fulfilled, (state, action) => {
        state.pending = false
        state.securityAcademy = action?.payload?.data
      })
      .addMatcher(
        isPedingAction,
        (state, action) => {          
          state.pending = true
        }
      )
      .addMatcher(
        isRejectedAction,
        (state, action) => {
          state.pending = false
          if (typeof action.error.message === 'string') {
            state.error = action.error.message
          } else {
            state.error = 'Oops, something has gone wrong'
          }
        }
      )
  }
})
export const { setError } = securityAcademySlice.actions
export const selectSecurityAcademy = (state: RootState) => state.securityAcademy
export default securityAcademySlice.reducer