'use strict'
const _ = require('lodash')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getUserResponse(ctx) {
    const { groupId, responseId } = ctx.request.body
    const formId = await strapi.services['question-group'].getTypeformQuestionId(ctx, groupId)
    let [question, { answers }] = await Promise.all([
      strapi.plugins['cnc-core'].externals.typeform.getAssessmentForm({
        formId,
      }),

      strapi.plugins['cnc-core'].externals.typeform.getAssessmentResponse({
        formId,
        responseId,
      }),
    ])

    question = _.map(question, _.partialRight(_.pick, ['id', 'title', 'ref', 'type']))

    return _.values(_.merge(_.keyBy(question, 'id'), _.keyBy(answers, 'field.id')))
  },

  async find(ctx) {
    try {
      const { user } = ctx.state

      const data = await strapi.services['question-group'].find(user)

      ctx.body = data
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },
}
