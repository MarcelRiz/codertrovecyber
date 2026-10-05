'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  findAllPackage: async (ctx) => {
    try {
      const dataPackage = await strapi.services['package'].findAll(ctx.query)
      return dataPackage
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  findOnePackage: async (ctx) => {
    try {
      const dataPackage = await strapi.services['package'].findOne(ctx.params.id)
      return dataPackage
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  createPackage: async (ctx) => {
    try {
      const dataPackage = await strapi.services['package'].create(ctx.request.body)
      return dataPackage
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  updatePackage: async (ctx) => {
    try {
      const dataPackage = await strapi.services['package'].update(ctx.params.id, ctx.request.body)
      return dataPackage
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },

  removePackage: async (ctx) => {
    try {
      const dataPackage = await strapi.services['package'].remove(ctx.params.id)
      return dataPackage
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },
}
