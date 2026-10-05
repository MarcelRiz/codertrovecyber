'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findAll: async (ctx) => {
    try {
      const data = await strapi.services['package-version'].findAll(ctx.query)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  findOne: async (ctx) => {
    try {
      const data = await strapi.services['package-version'].findOne(ctx.params.id)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  create: async (ctx) => {
    try {
      const data = await strapi.services['package-version'].create(ctx.request.body)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  update: async (ctx) => {
    try {
      const data = await strapi.services['package-version'].update(ctx.params.id, ctx.request.body)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  remove: async (ctx) => {
    try {
      const data = await strapi.services['package-version'].remove(ctx.params.id)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },
}
