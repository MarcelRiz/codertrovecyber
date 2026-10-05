'use strict'

module.exports = {
  async summary(userId) {
    const user = await strapi.query('user', 'users-permissions').findOne(
      {
        id: userId,
      },
      ['companies']
    )

    if (!user.companies?.length && !user.companies[0].id) {
      throw new Error('User dont have any company')
    }

    const company = await strapi.query('company').findOne({
      id: user.companies[0].id,
    })
    if (!company) {
      throw new Error('Company not found')
    }

    const totalCoursesQ = strapi.query('course').count()

    const totalCompanyPolicyQ = strapi.query('company-policy').count({
      type: 'CompanyPolicy',
      company: company.id,
    })
    const totalCyberPolicyQ = strapi.query('company-policy').count({
      type: 'CyberSecurity',
      isLive: true,
      company: company.id,
    })

    const [totalCourses, totalCompanyPolicy, totalCyberPolicy] = await Promise.all([
      totalCoursesQ,
      totalCompanyPolicyQ,
      totalCyberPolicyQ,
    ])

    const companyUserIds = [user.id]

    let staffAwarenessDone = 0
    let policyAcknowledged = 0

    if (companyUserIds.length > 0) {
      const staffAwarenessDoneQ = strapi.query('staff-assigned-course').count({
        quizTypeformResponseID_null: false,
        user: companyUserIds,
      })

      const policyAcknowledgedQ = strapi.query('staff-assigned-policy').count({
        isAcknowledged: true,
        user: companyUserIds,
      })

      staffAwarenessDone = await staffAwarenessDoneQ
      policyAcknowledged = await policyAcknowledgedQ
    }

    const staffAwarenessTotal = totalCourses * companyUserIds.length
    let staffAwarenessOutstanding = 0
    let staffAwarenessCompleted = 0
    if (staffAwarenessTotal) {
      staffAwarenessOutstanding = staffAwarenessTotal - staffAwarenessDone
      if (staffAwarenessDone) {
        staffAwarenessCompleted =
          Math.round((staffAwarenessDone / staffAwarenessTotal) * 100 * 100) / 100
      }
    }

    const policyTotal = (totalCompanyPolicy + totalCyberPolicy) * companyUserIds.length
    let policyOutstanding = 0
    let policyCompleted = 0
    if (policyTotal) {
      policyOutstanding = policyTotal - policyAcknowledged
      if (policyAcknowledged) {
        policyCompleted = Math.round((policyAcknowledged / policyTotal) * 100 * 100) / 100
      }
    }

    return {
      staffAwarenessTotal,
      staffAwarenessOutstanding,
      staffAwarenessCompleted,
      policyTotal,
      policyOutstanding,
      policyAcknowledged,
      policyCompleted,
    }
  },

  async summaryByUser(userId) {
    const knex = strapi.connections.default
    const courses = await knex('courses').select(
      'id',
      'name',
      'description',
      'typeformID',
      'videoLink'
    )

    const userPolicies = await strapi.query('staff-assigned-policy').find({
      user: userId,
    })

    const mapUserPolicies =
      userPolicies.length > 0 &&
      userPolicies.reduce((acc, curr) => {
        const policyDetail = {
          id: curr.companyPolicy.id,
          name: curr.companyPolicy.name,
          isLive: curr.companyPolicy.isLive,
          staffAssignedPolicies: {
            id: curr.id,
          },
          status: curr.isAcknowledged ? 'Acknowledged' : 'Pending',
        }

        if (!acc[curr.companyPolicy.type]) {
          Object.assign(acc, {
            [curr.companyPolicy.type]: [policyDetail],
          })
        } else {
          acc[curr.companyPolicy.type].push(policyDetail)
        }

        return acc
      }, {})

    const userCourse = await knex('courses')
      .leftJoin('staff_assigned_courses', 'staff_assigned_courses.course', 'courses.id')
      .select(
        knex.raw(
          `
            json_build_object(
              'id', courses.id,
              'name', courses.name,
              'user', json_build_object(
                'id', staff_assigned_courses.id,
                'userId', staff_assigned_courses.user,
                'courseId', staff_assigned_courses.course ,
                'quizTypeformResponseId', staff_assigned_courses."quizTypeformResponseID"
              )
            ) as course
          `
        )
      )
      .where('staff_assigned_courses.user', userId)

    const mapperUserCourse = userCourse.reduce((acc, curr) => {
      if (curr) {
        Object.assign(acc, {
          [curr.course?.id]: {
            ...curr.course,
          },
        })
      }

      return acc
    }, {})

    const mapUserCourses = courses.map((course) => {
      return {
        ...course,
        user: mapperUserCourse[course.id]?.user || {},
        status: mapperUserCourse[course.id]?.user ? 'Completed' : 'Pending',
      }
    })

    return {
      course: mapUserCourses,
      policies: mapUserPolicies,
    }
  },
}
