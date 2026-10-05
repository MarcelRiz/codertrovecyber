'use strict'

const EmailHelper = require('../../../helpers/EmailHelper')

const handler = async (log) => {
  let { pendingUsers: pendingStaffs } = await strapi.plugins['cnc-cron'].services[
    'pending-course-policy'
  ].get('staff')

  pendingStaffs = pendingStaffs.map((staff) => ({
    ...staff,
    pendingCourses: staff.pendingCourses || 0,
    pendingPolicies: staff.pendingPolicies || 0,
  }))

  pendingStaffs = pendingStaffs.filter(
    (staff) => staff.pendingCourses > 0 || staff.pendingPolicies > 0
  )

  pendingStaffs.map((staff) => {
    EmailHelper.sendPendingItemEmail({
      ...staff,
      pendingCourses: staff.pendingCourses,
      pendingPolicies: staff.pendingPolicies,
    })
  })

  log({
    pendingStaffs,
  })
}

module.exports = {
  defaultRepeat: 'every2Week',
  handler,
}
