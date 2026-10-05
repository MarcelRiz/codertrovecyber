const endpoint = {
  base: process.env.NEXT_PUBLIC_API,
  assessment: {
    submit: '/assessment/submit',
    questionGroups: '/question-groups',
  },
  actionItems: {
    base: '/action-items',
    done: '/action-items/{id}/done',
  },
  courses: {
    base: '/courses',
    count: '/courses/count',
    staffAssignedCourses: '/staff-assigned-courses',
    staffAssignedCoursesCount: '/staff-assigned-courses/count',
  },
  companyPolicy: {
    base: '/company-policies',
    count: '/company-policies/count',
    staffAssignedPolicies: '/staff-assigned-policies',
    staffAssignedPoliciesCount: '/staff-assigned-policies/count',
    generate: '/company-policies/generate-cyber-policies',
    download: '/company-policies/{id}/download',
    preview: '/company-policies/preview',
  },
  policyTemplate: {
    base: '/policy-templates',
  },
  reports: {
    base: '/reports',
    reportTypes: '/report-types',
  },
  auth: {
    registerStaff: '/auth/local/register-staff',
    requestOtp: '/auth/request-otp',
    login: '/auth/local',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    selfRegister: '/auth/local/register-client/self',
  },
  users: {
    base: '/users',
    changePassword: '/users/change-password',
    importStaff: '/users/import-staff',
    summary: '/users/summary',
    createPhishingGroup: '/users/phishing-groups',
    updateUserRole: '/users/roles/{userId}',
    summaryByUser: '/users/{userId}/summary',
  },
  gophish: {
    createGroup: '/gophish/groups',
  },
  industries: {
    base: '/industries',
  },
  companies: {
    base: '/companies',
    summary: '/companies/{id}/summary',
  },
  departments: {
    base: '/departments',
  },
  blogCategories: {
    base: 'blog-categories',
  },
  blogs: {
    base: 'blogs',
  },
  vulnerabilityScan: {
    base: 'vulnerability-scan',
    getList: 'vulnerability-scan/getListSqlInjection',
    getOne: 'vulnerability-scan/getOneSqlInjection',
    history: 'scanning-history',
    detail: 'scanning-history/{id}',
  },
  manageScanning: {
    base: 'manage-scanning',
  },
  fileManagement: {
    base: 'file-google-storages',
  },
  marketplace: {
    base: 'market-places',
    getOne: 'market-places/{id}',
  },
}

export default endpoint

export function makeUrl(url, params) {
  let final = url
  Object.keys(params).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g')
    final = final.replace(regex, params[key])
  })
  return final
}
