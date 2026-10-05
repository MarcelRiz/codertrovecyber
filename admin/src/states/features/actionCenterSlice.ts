import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"
import { ActionItemSource } from '../../constants/action-item'
import { RootState } from "../store"

export type actionCenterState = {
  lists: any,
  data: any,
  pending: boolean,
  error: any
}

const initialState: actionCenterState = {
  lists: [],
  data: {},
  pending: false,
  error: null
}

export const createCustomActionItems = createAsyncThunk('actionCenter/createCustomActionItems', async (payload: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}​/custom-action-items`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const updatedCustomActionItems = createAsyncThunk('actionCenter/updatedCustomActionItems', async (payload: any) => {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}​/custom-action-items/${payload?.id}`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const getActionItems = createAsyncThunk('actionCenter/getActionItems', async (payload: any) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}​/users/${payload?.id}`)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const ceateActionItems = createAsyncThunk('actionCenter/ceateActionItems', async (payload: any) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}​/user-action-items`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const deleteCustomActionItem = createAsyncThunk('actionCenter/deleteCustomActionItem', async (payload: any) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}​/custom-action-items/${payload?.id}`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

export const deleteActionItem = createAsyncThunk('actionCenter/deleteActionItem', async (payload: any) => {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}​/action-items/${payload?.id}`, payload)
    return response
  } catch (error) {
    throw error.response.data
  }
})

function isPedingAction(action: AnyAction) {
  return action.type.startsWith('actionCenter') && action.type.endsWith('pending')
}

function isRejectedAction(action: AnyAction) {
  return action.type.startsWith('actionCenter') && action.type.endsWith('rejected')
}

function mapActionItem(item) {
  let actionItemName = ''
  let actionItemSource = ''
  let priority = ''
  let category = ''
  let controlMapping = ''
  let securityDomain = ''

  if(item?.type === ActionItemSource.customActionItem) {
    actionItemName = item?.customActionItem?.actionItemSummary
    actionItemSource = item?.customActionItem?.actionItemSource
    priority = item?.customActionItem?.priority
    category = item?.customActionItem?.category
    securityDomain = item?.customActionItem?.securityDomain
    controlMapping = item?.customActionItem?.controlMapping
  }
  if(item?.type === ActionItemSource.actionItem) {
    actionItemName = item?.actionItem?.actionItemSummary
    actionItemSource = 'actionItem'
    priority = item?.actionItem?.priority
    category = item?.actionItem?.category
    securityDomain = item?.actionItem?.securityDomain
    controlMapping = item?.actionItem?.controlMapping
  }
  return {
    ...item,
    reportTypeName: item?.reportType?.name || '',
    actionItemName,
    actionItemSource,
    priority,
    category,
    securityDomain,
    controlMapping
  }
}

function mapActionCustomItem(item) {
  return {
    ...item,
    actionItemName: item?.actionItemSummary,
    actionItemSource: item?.actionItemSource,
    priority: item?.priority,
    state: 'unresolved',
    type: ActionItemSource.customActionItem,
    category: item?.category,
    controlMapping: item?.controlMapping,
    securityDomain: item?.securityDomain    
  }
}

const actionCenterSlice = createSlice({
  name: 'actionCenter',
  initialState,
  reducers: {
    resetData: (state, action) => {
      state.data = {}
      state.lists = []
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActionItems.fulfilled, (state, action) => {
        state.pending = false
        let userActionItems = action.payload?.data?.userActionItems
        if(userActionItems) {
          userActionItems = userActionItems.map(item => {
            return mapActionItem(item)
          })
        }
        state.data = action.payload?.data || []
        state.lists = userActionItems?.filter(item => item?.customActionItem || item?.actionItem) || []
      })
      .addCase(createCustomActionItems.fulfilled, (state, action) => {
        state.pending = false
        state.lists.push(mapActionCustomItem({
          ...action.payload?.data, 
          customActionItem: action.payload?.data
        }))    
      })
      .addCase(updatedCustomActionItems.fulfilled, (state, action) => {
        state.pending = false
        const data = action.payload?.data   
        const listAction = state.lists
        state.lists = listAction.map(item => {
          let updateItem = item
          if(item?.customActionItem?.id === data.id) {
            updateItem = {
              ...updateItem,
              customActionItem: {
                ...updateItem.customActionItem,
                ...data
              }
            }
            updateItem = mapActionItem(updateItem)
          }
          return updateItem
        })
      })
      .addCase(deleteActionItem.fulfilled, (state, action) => {
        state.pending = false
        state.lists = state.lists.filter(item => item?.id !== action.payload?.data?.id)
      })
      .addCase(deleteCustomActionItem.fulfilled, (state, action) => {
        state.pending = false
        state.lists = state.lists.filter(item => item?.id !== action.payload?.data?.id)
      })
      .addMatcher(
        isPedingAction,
        (state, action) => {
          if(action?.type === 'actionCenter/actionCenter/getActionItems') {
            state.data = null
            state.lists = []
          }
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
export const { setError, resetData } = actionCenterSlice.actions
export const selectActionCenter = (state: RootState) => state.actionCenter
export default actionCenterSlice.reducer