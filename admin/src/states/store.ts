/* eslint-disable import/no-cycle */
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import actionCenterSlice from './features/actionCenterSlice'
import companySlice from './features/companySlice'
import dashboardReducer from './features/dashboardSlice'
import fileSlice from './features/fileSlice'
import industrySlice from './features/industrySlice'
import userManagementSlice from './features/userManagementSlice'
import userProfileSlice from './features/userProfileSlice'
import actionReportSlice from './features/actionReportsSlice'
import companyStaffSlice from './features/companyStaffSlice'
import securityAcademySlice from './features/securityAcademySlice'
import departmentSlice from './features/departmentSlice'
import blogCategoryManagementSlice from './features/blogCategoryManagementSlice'
import blogManagementSlice from './features/blogManagementSlice'
import uploadFileManagementSlice from './features/uploadFileManagementSlice'
import manageScanningSlice from './features/manageScanningSlice'
import packagesSlice from './features/packageSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    userManagement: userManagementSlice,
    userPofile: userProfileSlice,
    company: companySlice,
    industry: industrySlice,
    file: fileSlice,
    actionCenter: actionCenterSlice,
    actionReport: actionReportSlice,
    companyStaff: companyStaffSlice,
    securityAcademy: securityAcademySlice,
    department: departmentSlice,
    blogCategoryManagement: blogCategoryManagementSlice,
    blogManagement: blogManagementSlice,
    uploadFileManagement: uploadFileManagementSlice,
    manageScanningManagement: manageScanningSlice,
    packages: packagesSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
