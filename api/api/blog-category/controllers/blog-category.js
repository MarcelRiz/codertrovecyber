'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async delete(ctx) {
    try {
      const { id } = ctx.params
      const data = await strapi.services['blog-category'].delete(id)
      ctx.body = data
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },
}
