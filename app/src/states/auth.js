/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import UserService from '../services/UserService'
import DepartmentService from '../services/DepartmentService'

const initialState = {
  session: null,
  requestingOTP: false,
  loggingIn: false,
  updatingProfile: false,
  industries: [],
  updatingCompany: false,
  fetchMeTime: new Date().getTime(),
  submittingForgotPassword: false,
  forgotPasswordStep: 1,
  resettingPassword: false,
  changingPassword: false,
  companySummary: {},
  useSummary: {},
  userSummaryDetail: {},
  departments: [],
  isAckGuideTips: true,
}

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ identifier, password, otp }) => {
    const response = await UserService.login(identifier, password, otp)
    return response.data
  }
)

export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async ({ identifier, password }) => {
    try {
      const response = await UserService.requestOTP(identifier, password)
      return response.data
    } catch (err) {
      return err
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async data => {
    const response = await UserService.updateProfile(data)
    return response.data
  }
)

export const me = createAsyncThunk('auth/me', async () => {
  const response = await UserService.me()
  return response.data
})

export const getIndustries = createAsyncThunk('industries', async () => {
  const response = await UserService.getIndustries()
  return response.data
})

export const updateCompany = createAsyncThunk(
  'updateCompany',
  async (data, thunkAPI) => {
    const state = thunkAPI.getState()
    const company = state.auth?.session?.user?.companies[0]
    const response = await UserService.updateCompany(company.id, data)
    return response.data
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async identifier => {
    const response = await UserService.forgotPassword(identifier)
    return response.data
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ code, password, passwordConfirmation }) => {
    const response = await UserService.resetPassword(
      code,
      password,
      passwordConfirmation
    )
    return response.data
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, password, passwordConfirmation }) => {
    const response = await UserService.changePassword(
      currentPassword,
      password,
      passwordConfirmation
    )
    return response.data
  }
)

export const getCompanySummary = createAsyncThunk(
  'company/summary',
  async (_, thunkApi) => {
    const state = thunkApi.getState()
    const company = state.auth.session.user.companies[0].id
    const response = await UserService.companySummary(company)
    return response.data
  }
)

export const getUserSummary = createAsyncThunk('users/summary', async () => {
  const response = await UserService.userSummary()
  return response.data
})

export const getUserSummaryDetail = createAsyncThunk(
  'users/summaryDetail',
  async userId => {
    const response = await UserService.userSummaryDetail(userId)
    return response.data
  }
)

export const getDepartment = createAsyncThunk('users/department', async () => {
  const response = await DepartmentService.getDepartments()
  return response.data
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.session = {
        user: null,
        jwt: null,
      }
    },
    setSession: (state, action) => {
      state.session = action.payload
    },
    setFetchMeTime: state => {
      state.fetchMeTime = new Date().getTime()
      // actually a trigger
    },
    resetForgotPasswordStep: state => {
      state.forgotPasswordStep = 1
    },
  },
  extraReducers: builder => {
    // Request OTP
    builder.addCase(requestOTP.pending, state => {
      state.requestingOTP = true
    })
    builder.addCase(requestOTP.fulfilled, state => {
      state.requestingOTP = false
    })
    builder.addCase(requestOTP.rejected, state => {
      state.requestingOTP = false
    })

    // Login
    builder.addCase(login.pending, state => {
      state.loggingIn = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.session = action.payload
      state.loggingIn = false
    })
    builder.addCase(login.rejected, state => {
      state.loggingIn = false
    })

    // update profile
    builder.addCase(updateProfile.pending, state => {
      state.updatingProfile = true
    })
    builder.addCase(updateProfile.fulfilled, state => {
      state.updatingProfile = false
    })
    builder.addCase(updateProfile.rejected, state => {
      state.updatingProfile = false
    })

    // me
    builder.addCase(me.pending, state => {
      state.session.user = { ...state.session.user, isAckGuideTips: true }
    })
    builder.addCase(me.fulfilled, (state, action) => {
      state.session.user = action.payload
    })

    // industries
    builder.addCase(getIndustries.fulfilled, (state, action) => {
      state.industries = action.payload
    })

    // update company
    builder.addCase(updateCompany.pending, state => {
      state.updatingCompany = true
    })
    builder.addCase(updateCompany.fulfilled, state => {
      state.updatingCompany = false
    })
    builder.addCase(updateCompany.rejected, state => {
      state.updatingCompany = false
    })

    // forgot password
    builder.addCase(forgotPassword.pending, state => {
      state.submittingForgotPassword = true
      state.forgotPasswordStep = 1
    })
    builder.addCase(forgotPassword.fulfilled, state => {
      state.submittingForgotPassword = false
      state.forgotPasswordStep = 2
    })
    builder.addCase(forgotPassword.rejected, state => {
      state.submittingForgotPassword = false
      state.forgotPasswordStep = 1
    })

    // forgot password
    builder.addCase(resetPassword.pending, state => {
      state.resettingPassword = true
    })
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.session = action.payload
      state.resettingPassword = false
    })
    builder.addCase(resetPassword.rejected, state => {
      state.resettingPassword = false
    })

    // change password
    builder.addCase(changePassword.pending, state => {
      state.changingPassword = true
    })
    builder.addCase(changePassword.fulfilled, state => {
      state.changingPassword = false
    })
    builder.addCase(changePassword.rejected, state => {
      state.changingPassword = false
    })

    // company summary
    builder.addCase(getCompanySummary.fulfilled, (state, action) => {
      state.companySummary = action.payload
    })

    // user summary
    builder.addCase(getUserSummary.fulfilled, (state, action) => {
      state.userSummary = action.payload
    })

    // user summary detail
    builder.addCase(getUserSummaryDetail.fulfilled, (state, action) => {
      state.userSummaryDetail = action.payload
    })

    // get department
    builder.addCase(getDepartment.fulfilled, (state, action) => {
      state.departments = action.payload
    })
  },
})

// Action creators are generated for each case reducer function
export const { logout, setSession, setFetchMeTime, resetForgotPasswordStep } =
  authSlice.actions

export default authSlice.reducer
