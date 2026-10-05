import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"
import {SortByFields} from '../../utilities/helps'
import { RootState } from "../store"

export type actionReportsState = {
  entities: any,
  reportTypes: any,
  data: any,
  pending: boolean,
  error: any,
  loading: boolean
}

const initialState: actionReportsState = {
  entities: [],
  reportTypes: [],
  data: {},
  pending: false,
  error: null,
  loading: false
}

export const createActionReport= createAsyncThunk('actionReport/createActionReport', async (payload: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}​/reports`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const updateActionReport= createAsyncThunk('actionReport/updateActionReport', async (payload: any) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}​/reports/${payload?.id}`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const getActionReport = createAsyncThunk('actionReport/getActionReport', async (payload: any) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}​/reports?user=${payload?.id}`)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const deleteActionReport = createAsyncThunk('actionReport/deleteActionReport', async (payload: any) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}​/reports/${payload.id}`)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const getReportTypes = createAsyncThunk('actionReport/getReportTypes', async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}​/report-types`)
    return response
  } catch (error) {
    throw error.response.data
  }
})



function isPedingAction(action: AnyAction) {
  return action.type.startsWith('actionReport') && action.type.endsWith('pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.startsWith('actionReport') && action.type.endsWith('rejected')
}

const actionReportSlice = createSlice({
  name: 'actionReport',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActionReport.fulfilled, (state, action) => {
        state.pending = false
        let data = action.payload?.data
        if(data) {
          data = data.map(item => {
            return {
              ...item,
              reportTypeName: item?.reportType?.name || '',
              pdfUrl: item?.pdf?.url,
              pdfName: item?.pdf?.name
            }
          })
        }
        state.entities = data || []
      })
      .addCase(createActionReport.fulfilled, (state, action) => {
        state.pending = false
        state.loading = false
        let data = action.payload?.data
        if(data) {
          data = {
            ...data,
            reportTypeName: data?.reportType?.name || '',
            pdfUrl: data?.pdf?.url,
            pdfName: data?.pdf?.name
          }
        }
        state.entities.push(data)
      })
      .addCase(getReportTypes.fulfilled, (state, action) => {
        state.pending = false
        let data = action.payload?.data 
        if(data?.length > 0) {
          data = SortByFields(data, 'name')
          state.reportTypes = data
        }
      })
      .addCase(updateActionReport.fulfilled, (state, action) => {
        state.pending = false
        const reports = state.entities
        state.entities = reports?.map(item => {
          let updateItem = item
          if(item?.id === action?.payload?.data?.id) {
            updateItem = {
              ...item,
              ...action?.payload?.data
            }
          }
          return updateItem
        })
      })
      .addCase(deleteActionReport.fulfilled, (state, action) => {
        state.pending = false
        const reports = state.entities
        state.entities = reports?.filter(item => item.id !== action?.payload?.data?.id)
      })
      .addMatcher(
        isPedingAction,
        (state, action) => {
          if(action.type === 'actionReport/actionReport/createActionReport' ||
            action.type == 'actionReport/actionReport/updateActionReport'
          ) {
            state.loading = true
          }
          state.pending = true
        }
      )
      .addMatcher(
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
export const { setError } = actionReportSlice.actions
export const selectActionReport = (state: RootState) => state.actionReport
export default actionReportSlice.reducer