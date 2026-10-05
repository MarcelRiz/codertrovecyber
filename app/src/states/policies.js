/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import PoliciesService from '../services/PoliciesService'
import { USER_ROLE } from '../constants'

const initialState = {
  policies: [],
  gettingPolicies: false,
  showGenerate: false,
  showEditCyberPolicy: false,
  showUploadPolicy: false,
  savingPolicy: false,
  editingCompanyPolicy: null,
  acknowledgePolicy: null,
  showAcknowledgeModal: false,
  sendingAcknowledgment: false,
  assignedPolicies: [],
  gettingAssignedPolicies: false,
  templates: [],
  generatingPolicies: false,
  editingCyberPolicy: null,
  search: '',
  savingCyberPolicy: false,
  assigningCompanyPolicy: null,
  assigningCompanyPolicies: null,
}

export const getAllPolicies = createAsyncThunk(
  'policies/get',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth.session?.user
    if (user) {
      const companyId = user?.companies[0]?.id
      const isLiveOnly = user?.role?.name === USER_ROLE.STAFF
      const response = await PoliciesService.getAllPolicies(
        companyId,
        isLiveOnly
      )
      return response.data
    }
    return []
  }
)

export const createCompanyPolicy = createAsyncThunk(
  'companyPolicy/create',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState()
    const company = state.auth?.session?.user?.companies[0]
    const response = await PoliciesService.createCompanyPolicy({
      ...data,
      company: company.id,
    })
    return response.data
  }
)

export const updateCompanyPolicy = createAsyncThunk(
  'companyPolicy/update',
  async ({ id, data }) => {
    const response = await PoliciesService.updateCompanyPolicy(id, data)
    return response.data
  }
)

export const getOneCompanyPolicy = createAsyncThunk(
  'companyPolicy/getCompanyById',
  async ({ id }) => {
    const response = await PoliciesService.getCompanyPolicyById(id)
    return response.data
  }
)

export const deletePolicy = createAsyncThunk('policies/delete', async id => {
  const response = await PoliciesService.deletePolicy(id)
  return response.data
})

export const sendAcknowledgePolicy = createAsyncThunk(
  'policies/acknowledgePolicy',
  async (policyId, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const response = await PoliciesService.acknowledgePolicy(user.id, policyId)
    return response.data
  }
)

export const getAssignedPolicies = createAsyncThunk(
  'policies/assigned',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const response = await PoliciesService.getAssignedPolicies(user.id)
    return response.data
  }
)

export const getPolicyTemplates = createAsyncThunk(
  'templates/get',
  async () => {
    const response = await PoliciesService.getPolicyTemplates()
    return response.data
  }
)

export const generatePolicies = createAsyncThunk(
  'policies/generate',
  async ({ policiesTemplateIds, owner }, thunkAPI) => {
    const state = thunkAPI.getState()
    const company = state.auth?.session?.user?.companies[0]
    const response = await PoliciesService.generatePolicies(
      company.id,
      policiesTemplateIds,
      owner
    )
    return response.data
  }
)

export const updateCyberPolicy = createAsyncThunk(
  'policies/update',
  async ({ policyId, policyContent }) => {
    const response = await PoliciesService.updateCyberPolicy(
      policyId,
      policyContent
    )
    return response
  }
)

export const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    openGenerateModal: state => {
      state.showGenerate = true
    },
    closeGenerateModal: state => {
      state.showGenerate = false
    },
    openEditCyberModal: (state, action) => {
      state.showEditCyberPolicy = true
      state.editingCyberPolicy = action.payload
    },
    closeEditCyberModal: state => {
      state.showEditCyberPolicy = false
    },
    openUploadPolicy: (state, action) => {
      state.showUploadPolicy = true
      state.editingCompanyPolicy = action.payload || null
    },
    closeUploadPolicy: state => {
      state.showUploadPolicy = false
    },
    openAcknowledgePolicy: (state, action) => {
      state.acknowledgePolicy = action.payload
      state.showAcknowledgeModal = true
    },
    closeAcknowledgePolicy: state => {
      state.showAcknowledgeModal = false
    },
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setAssigningCompanyPolicy: (state, action) => {
      state.assigningCompanyPolicy = action.payload
    },
    setAssigningCompanyPolicies: (state, action) => {
      state.assigningCompanyPolicies = action.payload
    },
  },
  extraReducers: {
    [createCompanyPolicy.pending]: state => {
      state.savingPolicy = true
    },
    [createCompanyPolicy.fulfilled]: state => {
      state.savingPolicy = false
    },
    [createCompanyPolicy.rejected]: state => {
      state.savingPolicy = false
    },

    [updateCompanyPolicy.pending]: state => {
      state.savingPolicy = true
    },
    [updateCompanyPolicy.fulfilled]: state => {
      state.savingPolicy = false
    },
    [updateCompanyPolicy.rejected]: state => {
      state.savingPolicy = false
    },

    [getAllPolicies.pending]: state => {
      state.gettingPolicies = true
      state.policies = []
    },
    [getAllPolicies.fulfilled]: (state, action) => {
      state.gettingPolicies = false
      state.policies = action.payload
    },
    [getAllPolicies.rejected]: state => {
      state.gettingPolicies = false
      state.policies = []
    },

    [sendAcknowledgePolicy.pending]: state => {
      state.sendingAcknowledgment = true
    },
    [sendAcknowledgePolicy.fulfilled]: state => {
      state.sendingAcknowledgment = false
    },
    [sendAcknowledgePolicy.rejected]: state => {
      state.sendingAcknowledgment = false
    },

    [getAssignedPolicies.pending]: state => {
      state.gettingAssignedPolicies = true
      state.assignedPolicies = []
    },
    [getAssignedPolicies.fulfilled]: (state, action) => {
      state.gettingAssignedPolicies = false
      state.assignedPolicies = action.payload
    },
    [getAssignedPolicies.pending]: state => {
      state.gettingAssignedPolicies = false
      state.assignedPolicies = []
    },

    // templates
    [getPolicyTemplates.pending]: state => {
      state.templates = []
    },
    [getPolicyTemplates.fulfilled]: (state, action) => {
      state.templates = action.payload
    },
    [getPolicyTemplates.rejected]: state => {
      state.templates = []
    },

    // generate
    [generatePolicies.pending]: state => {
      state.generatingPolicies = true
    },
    [generatePolicies.fulfilled]: state => {
      state.generatingPolicies = false
    },
    [generatePolicies.rejected]: state => {
      state.generatingPolicies = false
    },

    // update policy
    [updateCyberPolicy.pending]: state => {
      state.savingCyberPolicy = true
    },
    [updateCyberPolicy.fulfilled]: state => {
      state.savingCyberPolicy = false
    },
    [updateCyberPolicy.rejected]: state => {
      state.savingCyberPolicy = false
    },
  },
})

export const {
  openGenerateModal,
  closeGenerateModal,
  openEditCyberModal,
  closeEditCyberModal,
  openUploadPolicy,
  closeUploadPolicy,
  openAcknowledgePolicy,
  closeAcknowledgePolicy,
  setSearch,
  setAssigningCompanyPolicy,
  setAssigningCompanyPolicies,
} = policiesSlice.actions

export default policiesSlice.reducer
