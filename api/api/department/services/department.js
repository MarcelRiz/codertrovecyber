'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async summary(companyId) {
    let departments = await strapi.query('department').find()

    departments = await Promise.all(
      departments.map(async (department) => {
        const [departmentStaffs, totalCourses] = await Promise.all([
          strapi.query('user', 'users-permissions').find({
            departmentId: department.id,
          }),
          strapi.query('course').count(),
        ])

        const companyStaffs = departmentStaffs.filter((staff) =>
          staff.companies.find((company) => company.id === companyId)
        )

        const departmentStats = companyStaffs.reduce(
          (acc, staff) => {
            const acknowledgedPolicies = staff.staffAssignedPolicies.filter(
              (policy) => policy.isAcknowledged
            ).length
            const pendingPolicies = staff.staffAssignedPolicies.filter(
              (policy) => !policy.isAcknowledged
            ).length
            const completedCourses = staff.staffAssignedCourses.length
            const pendingCourses = totalCourses - staff.staffAssignedCourses.length
            acc.acknowledgedPolicies += acknowledgedPolicies
            acc.pendingPolicies += pendingPolicies
            acc.completedCourses += completedCourses
            acc.pendingCourses += pendingCourses
            return acc
          },
          { acknowledgedPolicies: 0, pendingPolicies: 0, completedCourses: 0, pendingCourses: 0 }
        )

        return { ...department, ...departmentStats, numberOfStaffs: companyStaffs.length }
      })
    )
    departments = departments.filter((department) => department.numberOfStaffs > 0)
    return departments
  },
}
