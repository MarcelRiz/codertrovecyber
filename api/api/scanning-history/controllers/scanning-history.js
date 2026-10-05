'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  list: async (ctx) => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const data = await strapi.services['scanning-history'].list(ctx.query)
      return data
    } catch (err) {
      console.log(err)
      ctx.badRequest(err.toString())
    }
  },

  findOne: async (ctx) => {
    try {
      const data = await strapi.services['scanning-history'].findOne(ctx.params.id)
      return data
    } catch (err) {
      ctx.badRequest(err.toString())
    }
  },
}
