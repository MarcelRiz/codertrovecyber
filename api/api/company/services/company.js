'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
// const knex = require('knex')

module.exports = {
  async summary(companyId) {
    const company = await strapi.query('company').findOne({
      id: companyId,
    })
    if (!company) {
      throw new Error('Company not found')
    }

    const staffRoleQ = strapi.query('role', 'users-permissions').findOne({
      type: 'staff',
    })

    const clientRoleQ = strapi.query('role', 'users-permissions').findOne({
      type: 'client',
    })

    const totalCompanyPolicyQ = strapi.query('company-policy').count({
      type: 'CompanyPolicy',
      company: company.id,
    })
    const totalCyberPolicyQ = strapi.query('company-policy').count({
      type: 'CyberSecurity',
      isLive: true,
      company: company.id,
    })

    const [staffRole, clientRole, totalCompanyPolicy, totalCyberPolicy] = await Promise.all([
      staffRoleQ,
      clientRoleQ,
      totalCompanyPolicyQ,
      totalCyberPolicyQ,
    ])

    const companyUsers = await strapi.query('user', 'users-permissions').find(
      {
        role: [staffRole.id, clientRole.id],
        companies: company.id,
      },
      ['companies', 'role']
    )

    const version = companyUsers.some((user) => user.version === 'full') ? 'full' : 'free'

    const totalCourses =
      version === 'free'
        ? await strapi.query('course').count({
            isFree: true,
          })
        : await strapi.query('course').count()

    const companyUserIds = []

    const mapperUser = companyUsers.reduce((acc, curr) => {
      companyUserIds.push(curr.id)

      Object.assign(acc, {
        [curr.id]: {
          userId: curr.id,
          email: curr.email,
          username: curr.username,
          firstName: curr.firstName,
          lastName: curr.lastName,
          role: {
            id: curr.role.id,
            name: curr.role.name,
            type: curr.role.type,
          },
          policy: {
            acknowledged: 0,
            pending: 0,
          },
          course: {
            completed: 0,
            pending: totalCourses || 0,
          },
        },
      })

      return acc
    }, {})

    let staffAwarenessDone = 0
    let policyAcknowledged = 0
    let policyTotal = 0

    if (companyUserIds.length > 0) {
      ;[staffAwarenessDone, policyAcknowledged, policyTotal] = await Promise.all([
        strapi.query('staff-assigned-course').count({
          quizTypeformResponseID_null: false,
          user: companyUserIds,
        }),
        strapi.query('staff-assigned-policy').count({
          isAcknowledged: true,
          user: companyUserIds,
        }),
        strapi.query('staff-assigned-policy').count({
          user: companyUserIds,
        }),
      ])
    }

    const staffAwarenessTotal = totalCourses * companyUsers.length
    let staffAwarenessOutstanding = 0
    let staffAwarenessCompleted = 0
    if (staffAwarenessTotal) {
      staffAwarenessOutstanding = staffAwarenessTotal - staffAwarenessDone
      if (staffAwarenessDone) {
        staffAwarenessCompleted =
          Math.round((staffAwarenessDone / staffAwarenessTotal) * 100 * 100) / 100
      }
    }

    let policyOutstanding = 0
    let policyCompleted = 0
    if (policyTotal) {
      policyOutstanding = policyTotal - policyAcknowledged
      if (policyAcknowledged) {
        policyCompleted = Math.round((policyAcknowledged / policyTotal) * 100 * 100) / 100
      }
    }

    const knex = strapi.connections.default

    const staffAssignedCourse = await knex('staff_assigned_courses')
      .select('id', 'course', 'user as userId', 'quizTypeformResponseID')
      .whereIn('user', companyUserIds)
      .whereNotNull('quizTypeformResponseID')

    const staffAssignedPolicies = await knex('staff_assigned_policies')
      .select('id', 'user as userId', 'companyPolicy', 'isAcknowledged')
      .whereIn('user', companyUserIds)

    const promiseMapperUser = await new Promise((resolve) => {
      const mirrorMapperUser = JSON.parse(JSON.stringify(mapperUser))
      for (const staffCourse of staffAssignedCourse) {
        if (mirrorMapperUser[staffCourse.userId]) {
          const completed = mirrorMapperUser[staffCourse.userId].course.completed + 1

          Object.assign(mirrorMapperUser[staffCourse.userId], {
            ...mirrorMapperUser[staffCourse.userId],
            course: {
              pending: totalCourses - completed,
              completed,
            },
          })
        }
      }

      for (const staffPolicy of staffAssignedPolicies) {
        if (mirrorMapperUser[staffPolicy.userId]) {
          let acknowledged = mirrorMapperUser[staffPolicy.userId].policy.acknowledged
          let pending = mirrorMapperUser[staffPolicy.userId].policy.pending

          if (staffPolicy.isAcknowledged) {
            acknowledged++
          } else {
            pending++
          }

          Object.assign(mirrorMapperUser[staffPolicy.userId], {
            ...mirrorMapperUser[staffPolicy.userId],
            policy: {
              pending,
              acknowledged,
            },
          })
        }
      }

      resolve(mirrorMapperUser)
    })

    return {
      staffAwarenessTotal,
      staffAwarenessOutstanding,
      staffAwarenessCompleted,
      policyTotal,
      policyOutstanding,
      policyAcknowledged,
      policyCompleted,
      overall: Object.values(promiseMapperUser),
    }
  },
}
