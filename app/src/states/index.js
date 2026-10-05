import { configureStore } from '@reduxjs/toolkit'
import common from './common'
import actionItems from './action-items'
import reports from './reports'
import checkins from './checkins'
import securityAcademy from './security-academy'
import policies from './policies'
import staffs from './staffs'
import auth from './auth'
import dashboard from './dashboard'
import blog from './blog'
import fileManagement from './fileManagement'
import vulnerabilityScanner from './vulnerabilityScanner'
import marketplace from './marketplace'
import manageScanning from './manageScanning'

const store = configureStore({
  reducer: {
    common,
    actionItems,
    reports,
    checkins,
    securityAcademy,
    policies,
    staffs,
    auth,
    dashboard,
    blog,
    fileManagement,
    vulnerabilityScanner,
    marketplace,
    manageScanning,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
