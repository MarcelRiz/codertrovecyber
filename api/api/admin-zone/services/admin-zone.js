'use strict';

/**
 * `admin` service.
 */

module.exports = {
  dashboardSummary: async () => {
    const knex = strapi.connections.default;

    const clientRoleQ = strapi.query('role', 'users-permissions').findOne({
      type: 'client'
    })

    const staffRoleQ = strapi.query('role', 'users-permissions').findOne({
      type: 'staff'
    })
    const totalCoursesQ = strapi.query('course').count()

    const totalCyberSecurityPoliciesQ = strapi.query('policy-template').count({})

    const userHasRatingQ = strapi.query('user', 'users-permissions').find({
      securityRating_null: false
    }, ['securityRating'])

    const knowledgeDoneQ = strapi.query('staff-assigned-course').count({
      quizTypeformResponseID_null: false
    })

    const policyByCompaniesQ = strapi.query('company-policy').model.query(qb => {
      qb.select(knex.raw('company, COUNT(id) AS policycount'));
      qb.where({
        type: "CompanyPolicy"
      }).orWhere({
        type: "CyberSecurity",
        isLive: true
      }).groupBy('company')
    })
      .fetchAll()

    const acknowledgePoliciesQ = strapi.query('staff-assigned-policy').count({
      isAcknowledged: true
    })

    const totalUserActionItemQ = strapi.query('user-action-item', 'cnc-core').count({
    })
    const outstandingUserActionItemQ = strapi.query('user-action-item', 'cnc-core').count({
      state: 'unresolved',
    })

    const totalPoliciesQ = strapi.query('staff-assigned-policy').count()

    const [
      clientRole,
      staffRole,
      totalCourses,
      totalCyberSecurityPolicies,
      userHasRating,
      knowledgeDone,
      policyByCompaniesPointer,
      acknowledgePolicies,
      totalUserActionItem,
      outstandingUserActionItem,
      totalPolicies
    ] = await Promise.all([
      clientRoleQ,
      staffRoleQ,
      totalCoursesQ,
      totalCyberSecurityPoliciesQ,
      userHasRatingQ,
      knowledgeDoneQ,
      policyByCompaniesQ,
      acknowledgePoliciesQ,
      totalUserActionItemQ,
      outstandingUserActionItemQ,
      totalPoliciesQ
    ])

    const totalClientsQ = strapi.query('user', 'users-permissions').count({
      role: clientRole.id
    })

    const totalStaffsQ = strapi.query('user', 'users-permissions').count({
      role: staffRole.id
    })

    const allUsersQ = strapi.query('user', 'users-permissions').find({
      role: [staffRole.id, clientRole.id]
    }, ['companies'])

    const [totalClients, totalStaffs, allUsers] = await Promise.all([totalClientsQ, totalStaffsQ, allUsersQ])

    const totalCompanySecurityRating = userHasRating.reduce((total, x) => total += x.securityRating?.company || 0, 0)
    const avgCompanySecurityRating = totalCompanySecurityRating / userHasRating.length

    const knowledgeTotal = totalCourses * totalStaffs
    const knowledgeOutstanding = knowledgeTotal - knowledgeDone
    const knowledgeCompleted = Math.round((knowledgeDone / knowledgeTotal * 100) * 100) / 100

    const policyByCompanies = policyByCompaniesPointer.toJSON();

    const companyDict = {}
    policyByCompanies.forEach(x => {
      companyDict[x.company.id] = {
        policy: parseInt(x.policycount),
        user: 0
      }
    })

    for (let user of allUsers) {
      for (let company of user.companies) {
        if (companyDict[company.id]) {
          companyDict[company.id].user += 1
        }
      }
    }

    const outstandingPolicies = totalPolicies - acknowledgePolicies
    const completedPolicies = Math.round((acknowledgePolicies / totalPolicies * 100) * 100) / 100

    const completedUserActionItem = Math.round(((totalUserActionItem - outstandingUserActionItem) / totalUserActionItem * 100) * 100) / 100

    return {
      totalClients,
      totalStaffs,
      totalCourses,
      totalCyberSecurityPolicies,
      avgCompanySecurityRating: Math.round(avgCompanySecurityRating * 100) / 100,
      knowledgeTotal,
      knowledgeOutstanding,
      knowledgeCompleted,
      totalPolicies,
      outstandingPolicies,
      completedPolicies,
      totalUserActionItem,
      outstandingUserActionItem,
      completedUserActionItem,
    }
  }
};
