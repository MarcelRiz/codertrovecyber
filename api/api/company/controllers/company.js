'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  summary: (ctx) => {
    const { id } = ctx.params
    try {
      return strapi.services['company'].summary(id)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },
}
