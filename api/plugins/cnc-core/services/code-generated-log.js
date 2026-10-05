'use strict'

const QueryHelper = require('../../../helpers/QueryHelper')

/**
 * cnc-core.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  async generate({ type, userId, value }) {
    const { id } = await QueryHelper.findOrCreate({
      source: ['code-generated-log', 'cnc-core'],
      query: {
        user: userId,
        type,
      },
    })

    return await strapi.query('code-generated-log', 'cnc-core').update(
      { id },
      {
        lastValue: value,
        generatedAt: new Date(),
      }
    )
  },

  async getUser({ type, value }) {
    const log = await strapi.query('code-generated-log', 'cnc-core').findOne({
      lastValue: value,
      type,
    })
    return strapi.query('user', 'users-permissions').findOne({
      email: log?.user?.email
    })

  },

  async isValid({ type, userId, value }) {
    const query = { type }
    userId ? (query.user = userId) : (query.lastValue = value)
    const log = await strapi.query('code-generated-log', 'cnc-core').findOne(query)

    if (!log) return false

    if (log.isLongLive) return true

    const { lastValue, generatedAt } = log
    const lastGeneratedAt = new Date(generatedAt).getTime()
    const duration = strapi.plugins['cnc-core'].config.codeGeneratedDuration[type]
    return lastValue == value && Date.now() - lastGeneratedAt < duration
  },

  async clear({ type, userId, value }) {
    const query = { type }
    userId ? (query.user = userId) : (query.lastValue = value)
    const log = await strapi.query('code-generated-log', 'cnc-core').findOne(query)
    if (log.isLongLive) return true
    await strapi.query('code-generated-log', 'cnc-core').delete(query)
  },
}
