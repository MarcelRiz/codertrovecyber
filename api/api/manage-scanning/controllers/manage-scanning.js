'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  list: async (ctx) => {
    try {
      const { limit, offset, ownerOfScanner } = ctx.query
      const data = await strapi.services['manage-scanning'].getAll({
        limit,
        offset,
        ownerOfScanner,
      })
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  create: async (ctx) => {
    try {
      const { ownerOfScanner, domain } = ctx.request.body

      const data = await strapi.services['manage-scanning'].create({ ownerOfScanner, domain })
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  remove: async (ctx) => {
    try {
      const data = await strapi.services['manage-scanning'].remove(ctx.params.id)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  update: async (ctx) => {
    try {
      const { ownerOfScanner, domain } = ctx.request.body
      const data = await strapi.services['manage-scanning'].update(ctx.params.id, {
        ownerOfScanner,
        domain,
      })
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },
}
