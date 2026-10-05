/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ActionItemsService from '../services/ActionItemsService'

const initialState = {
  viewingItem: null,
  showItemModal: false,
  showAssessment: false,
  submittingAssessment: false,
  resolving: false,
  selectedItems: [], // number[]
  bulkResolving: false,
  search: '',
  questionGroups: [],
}

export const submitAssessment = createAsyncThunk(
  'actionItems/submitAssessment',
  async responseId => {
    const response = await ActionItemsService.submitAssessment(responseId)
    return response.data
  }
)

export const markActionItemCompleted = createAsyncThunk(
  'actionItems/resolve',
  async userActionItemId => {
    const response = await ActionItemsService.markCompleted(userActionItemId)
    return response.data
  }
)

export const markActionItemCompletedBulk = createAsyncThunk(
  'actionItems/resolveBulk',
  userActionItemIds =>
    new Promise((resolve, reject) => {
      const promises = userActionItemIds.map(item =>
        ActionItemsService.markCompleted(item)
      )
      Promise.all(promises)
        .then(results => {
          resolve(results)
        })
        .catch(errors => {
          reject(errors)
        })
    })
)

export const getQuestionGroups = createAsyncThunk(
  'assessment/questionGroup',
  async () => {
    const response = await ActionItemsService.getQuestionGroup()
    return response.data
  }
)

export const actionItemsSlice = createSlice({
  name: 'actionItem',
  initialState,
  reducers: {
    openActionItem: (state, action) => {
      state.viewingItem = action.payload
      state.showItemModal = true
    },
    closeActionItem: state => {
      state.showItemModal = false
    },
    toggleAssessmentModal: (state, action) => {
      state.showAssessment = action.payload
    },
    toggleSelectItem: (state, action) => {
      if (!action.payload.checked) {
        const index = state.selectedItems.indexOf(action.payload.id)
        state.selectedItems.splice(index, 1)
      } else {
        state.selectedItems.push(action.payload.id)
      }
    },
    selectAllPendingItems: (state, action) => {
      state.selectedItems = action.payload
    },
    setSearch: (state, action) => {
      state.search = action.payload
    },
  },
  extraReducers: {
    [submitAssessment.pending]: state => {
      state.submittingAssessment = true
    },
    [submitAssessment.fulfilled]: state => {
      state.submittingAssessment = false
    },
    [submitAssessment.rejected]: state => {
      state.submittingAssessment = false
    },
    [markActionItemCompleted.pending]: state => {
      state.resolving = true
    },
    [markActionItemCompleted.fulfilled]: state => {
      state.resolving = false
    },
    [markActionItemCompleted.rejected]: state => {
      state.resolving = false
    },
    [markActionItemCompletedBulk.pending]: state => {
      state.bulkResolving = true
    },
    [markActionItemCompletedBulk.fulfilled]: state => {
      state.bulkResolving = false
      state.selectedItems = []
    },
    [markActionItemCompletedBulk.rejected]: state => {
      state.bulkResolving = false
    },

    // question group
    [getQuestionGroups.fulfilled]: (state, action) => {
      state.questionGroups = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  openActionItem,
  closeActionItem,
  toggleAssessmentModal,
  toggleSelectItem,
  selectAllPendingItems,
  setSearch,
} = actionItemsSlice.actions

export default actionItemsSlice.reducer
