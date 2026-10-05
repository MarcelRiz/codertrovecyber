'use strict'

const _ = require('lodash')

const countPolicy = (staff) =>
  strapi.query('company-policy').count({
    isLive: true,
    company: staff.companies[0]?.id,
  })

const pendingCoursePolicy = async (role) => {
  let staffs = await strapi.query('user', 'users-permissions').find(
    {
      'role.type': role,
    },
    ['staffAssignedPolicies', 'staffAssignedCourses', 'companies', 'role']
  )

  staffs = await Promise.all(
    staffs.map(async (staff) => {
      staff.totalCourse =
        staff.version === 'free'
          ? await strapi.query('course').count({ isFree: true })
          : await strapi.query('course').count()
      return staff
    })
  )

  const pendingStaffs = staffs.filter(
    async (staff) =>
      staff.staffAssignedPolicies.length >
        staff.staffAssignedPolicies.filter((assignedPolicy) => assignedPolicy.isAcknowledged) ||
      staff.staffAssignedCourses.length < staff.totalCourse
  )

  const staffLog = await Promise.all(
    pendingStaffs.map(async (staff) => {
      const logItem = _.pick(staff, [
        'id',
        'email',
        'staffAssignedPolicies',
        'staffAssignedCourses',
        'firstName',
        'lastName',
        'companies',
        'role.type',
        'totalCourse',
      ])
      logItem.staffAssignedPolicies = _.map(
        logItem.staffAssignedPolicies,
        _.partialRight(_.pick, ['id', 'isAcknowledged', 'companyPolicy'])
      )

      logItem.staffAssignedCourses = _.map(
        logItem.staffAssignedCourses,
        _.partialRight(_.pick, ['id', 'course', 'quizTypeformResponseID'])
      )

      logItem.totalPolicy = await countPolicy(staff)

      logItem.pendingCourses = logItem.totalCourse - logItem.staffAssignedCourses.length
      logItem.pendingPolicies =
        logItem.staffAssignedPolicies.length -
        logItem.staffAssignedPolicies.filter((assignedPolicy) => assignedPolicy.isAcknowledged)
          .length

      return logItem
    })
  )

  return {
    pendingUsers: staffLog,
  }
}

module.exports = {
  get: pendingCoursePolicy,
}
