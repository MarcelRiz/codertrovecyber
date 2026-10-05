'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async bulkAssignPolicies(user, policyIds, staffIds) {
    const knex = strapi.connections.default
    const data = await knex.transaction(async (trx) => {
      const promises = []
      policyIds.forEach((policyId) => {
        staffIds.forEach((staffId) => {
          promises.push(this.upsertAssignedPolicies(user, policyId, staffId))
        })
      })
      return await Promise.all(promises)
    })
    return data
  },

  async upsertAssignedPolicies(user, policyId, staffId) {
    const knex = strapi.connections.default
    const foundRecord = await knex('staff_assigned_policies').where({
      user: staffId,
      companyPolicy: policyId,
    })
    if (foundRecord.length) return foundRecord

    const newRecord = await knex('staff_assigned_policies').insert({
      user: staffId,
      companyPolicy: policyId,
      created_by: user.id,
    })

    if (newRecord) {
      await knex('company_policies').where('id', '=', policyId).update({
        isLive: true,
      })
    }
    return newRecord
  },
}
