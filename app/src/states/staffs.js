/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import StaffsService from '../services/StaffsService'
import UserService from '../services/UserService'

const initialState = {
  staffs: [],
  gettingStaffs: false,
  showAddModal: false,
  showAddModalGoPhish: false,
  showEditModal: false,
  showAssignStaffToPolicyModal: false,
  submittingStaff: false,
  editingStaff: null,
  importingStaff: false,
  submittingGroup: false,
  assignPolicyModal: false,
  newCreatedStaffs: [],
}

export const createGroupStaff = createAsyncThunk('staff/group', async data => {
  const response = await StaffsService.createGroupStaff(data)
  return response.data
})

export const registerStaff = createAsyncThunk('staff/register', async data => {
  const response = await StaffsService.registerStaff(data)
  return response.data
})

export const getStaffsList = createAsyncThunk(
  'staffs/list',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const companyId = state.auth?.session?.user?.companies[0]?.id
    const response = await StaffsService.getStaffsList(companyId)
    return response.data
  }
)

export const updateStaff = createAsyncThunk(
  'staffs/edit',
  async ({ id, data }) => {
    const response = await StaffsService.updateStaff(id, data)
    return response.data
  }
)

export const importStaff = createAsyncThunk('staff/import', async file => {
  const response = await UserService.importStaffs(file)
  return response.data
})

export const staffsSlice = createSlice({
  name: 'staffs',
  initialState,
  reducers: {
    openAddModal: state => {
      state.showAddModal = true
    },
    closeAddModal: state => {
      state.showAddModal = false
    },
    openAssignPolicyModal: (state, payload) => {
      state.newCreatedStaffs = payload.payload.users
      state.assignPolicyModal = true
    },
    closeAssignPolicyModal: state => {
      state.assignPolicyModal = false
      state.newCreatedStaffs = []
    },
    toggleGoPhishAddModal: (state, action) => {
      state.showAddModalGoPhish = action.payload
    },
    openEditStaff: (state, action) => {
      state.showEditModal = true
      state.editingStaff = action.payload
    },
    closeEditStaff: state => {
      state.showEditModal = false
      state.editingStaff = null
    },
    openAssignStaffToPolicyModal: state => {
      state.showAssignStaffToPolicyModal = true
    },
    closeAssignStaffToPolicyModal: state => {
      state.showAssignStaffToPolicyModal = false
    },
  },
  extraReducers: {
    // create-group-staff
    [createGroupStaff.pending]: state => {
      state.submittingStaff = true
    },
    [createGroupStaff.fulfilled]: state => {
      state.submittingStaff = false
    },
    [createGroupStaff.rejected]: state => {
      state.submittingStaff = false
    },

    // register-staff
    [registerStaff.pending]: state => {
      state.submittingStaff = true
    },
    [registerStaff.fulfilled]: state => {
      state.submittingStaff = false
      state.editingStaff = null
    },
    [registerStaff.rejected]: state => {
      state.submittingStaff = false
    },

    // getStaffs-list
    [getStaffsList.pending]: state => {
      state.gettingStaffs = true
      state.staffs = []
    },
    [getStaffsList.fulfilled]: (state, action) => {
      state.gettingStaffs = false
      state.staffs = action.payload
    },
    [getStaffsList.rejected]: state => {
      state.gettingStaffs = false
      state.staffs = []
    },

    // update-staff
    [updateStaff.pending]: state => {
      state.submittingStaff = true
    },
    [updateStaff.fulfilled]: state => {
      state.submittingStaff = false
    },
    [updateStaff.rejected]: state => {
      state.submittingStaff = false
    },

    // import staff
    [importStaff.pending]: state => {
      state.importingStaff = true
    },
    [importStaff.fulfilled]: state => {
      state.importingStaff = false
    },
    [importStaff.rejected]: state => {
      state.importingStaff = false
    },
  },
})

export const {
  openAddModal,
  closeAddModal,
  openEditStaff,
  closeEditStaff,
  toggleGoPhishAddModal,
  openAssignStaffToPolicyModal,
  closeAssignStaffToPolicyModal,
  openAssignPolicyModal,
  closeAssignPolicyModal,
} = staffsSlice.actions

export default staffsSlice.reducer
