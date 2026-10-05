'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    try {
      const { user } = ctx.state

      const data = await strapi.services['course'].find({
        user,
        ...ctx.request.query,
      })

      ctx.body = data
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },
}
