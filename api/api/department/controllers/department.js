'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  summary: async (ctx) => {
    try {
      const { user } = ctx.state
      const userData = await strapi.query('user', 'users-permissions').findOne(
        {
          id: user.id,
        },
        ['companies']
      )
      const companyId = userData?.companies[0]?.id
      const data = await strapi.services['department'].summary(companyId)
      ctx.body = data
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },

  async find() {
    return await strapi.query('department').model.fetchAll({
      columns: ['id', 'name', 'key'],
    })
  },
}
