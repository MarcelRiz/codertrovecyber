'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async find({ user, ...params }) {
    const { version } = user

    if (version === 'free') {
      return await strapi.query('course').find({
        isFree: true,
        ...params,
      })
    }
    return await strapi.query('course').find({ ...params })
  },
}
