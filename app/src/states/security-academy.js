/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CoursesService from '../services/CoursesService'

const initialState = {
  courses: [],
  gettingCourses: false,
  viewingCourse: null,
  showCourseModal: false,
  showCourseTypeform: false,
  assignedCourses: [],
  gettingAssignedCourses: false,
}

export const getCoursesList = createAsyncThunk('courses/get', async () => {
  const response = await CoursesService.getCourses()
  return response.data
})

export const getAssignedCourses = createAsyncThunk(
  'courses/get-assigned',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState()
    const user = state.auth?.session?.user
    const response = await CoursesService.getAssignedCourses(user.id)
    return response.data
  }
)

export const securityAcademySlice = createSlice({
  name: 'securityAcademy',
  initialState,
  reducers: {
    openCourse: (state, action) => {
      state.viewingCourse = action.payload
      state.showCourseModal = true
    },
    closeCourse: state => {
      state.showCourseModal = false
    },
    openCourseTypeform: (state, action) => {
      state.showCourseTypeform = true
      state.viewingCourse = action.payload
    },
    closeCourseTypeform: state => {
      state.showCourseTypeform = false
    },
  },
  extraReducers: {
    [getCoursesList.pending]: state => {
      state.gettingCourses = true
      state.courses = []
    },
    [getCoursesList.fulfilled]: (state, action) => {
      state.gettingCourses = false
      state.courses = action.payload
    },
    [getCoursesList.rejected]: state => {
      state.gettingCourses = false
    },
    [getAssignedCourses.pending]: state => {
      state.assignedCourses = []
      state.gettingAssignedCourses = true
    },
    [getAssignedCourses.fulfilled]: (state, action) => {
      state.assignedCourses = action.payload
      state.gettingAssignedCourses = false
    },
    [getAssignedCourses.rejected]: state => {
      state.assignedCourses = []
      state.gettingAssignedCourses = false
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  openCourse,
  closeCourse,
  openCourseTypeform,
  closeCourseTypeform,
} = securityAcademySlice.actions

export default securityAcademySlice.reducer
