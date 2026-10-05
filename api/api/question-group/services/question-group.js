'use strict'

const QueryHelper = require('../../../helpers/QueryHelper')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getTypeformQuestionId(ctx, groupId) {
    const questionGroup = await QueryHelper.findOneOrError(ctx, {
      name: 'Question group',
      source: ['question-group'],
      query: {
        id: groupId,
      },
    })
    const { typeformQuestionId } = questionGroup

    return typeformQuestionId
  },

  async getTotalGroup(userId) {
    const user = await strapi.query('user', 'users-permissions').findOne({
      id: userId,
    })
    return user.version === 'free'
      ? strapi.query('question-group').count({ isFree: true })
      : strapi.query('question-group').count()
  },

  async find({ version }) {
    const knex = strapi.connections.default
    let data

    if (version === 'free') {
      data = await knex('question_groups').where('isFree', true)
    } else {
      data = await knex('question_groups')
    }
    return data
  },
}
