'use strict'

const { STORAGE_POST_POLICY_BASE_URL } = require('@google-cloud/storage/build/src/file')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  bulkAssignPolicies: async (ctx) => {
    try {
      const { user } = ctx.state
      const { staffIds, policyIds } = ctx.request.body
      const data = await strapi.services['staff-assigned-policy'].bulkAssignPolicies(
        user,
        policyIds,
        staffIds
      )
      ctx.body = data
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },
}
