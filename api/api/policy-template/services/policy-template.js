'use strict'

const { isNull } = require('lodash')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async find({ version }) {
    const knex = strapi.connections.default
    let data

    if (version === 'free') {
      data = await knex('policy_templates').where('isFree', true)
    } else {
      data = await knex('policy_templates')
    }
    return data
  },
}
