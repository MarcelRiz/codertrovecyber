'use strict'

const { sumBy } = require('lodash')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const QueryHelper = require('../../../helpers/QueryHelper')

module.exports = {
  async getAssessmentResponse({ ctx, responseId, groupId }) {
    return QueryHelper.wrapError(ctx, {
      name: 'assessment response',
      data: await strapi.plugins['cnc-core'].externals.typeform.getAssessmentResponse({
        responseId,
        formId: await strapi.services['question-group'].getTypeformQuestionId(ctx, groupId),
      }),
    })
  },

  async getAssessmentQuestion({ ctx, groupId }) {
    return QueryHelper.wrapError(ctx, {
      name: 'assessment question',
      data: await strapi.plugins['cnc-core'].externals.typeform.getAssessmentForm({
        formId: await strapi.services['question-group'].getTypeformQuestionId(ctx, groupId),
      }),
    })
  },

  async isCompletedAssessment(userId) {
    const totalGroup = await strapi.services['question-group'].getTotalGroup(userId)
    const userGroup = await strapi.query('user-question-group', 'cnc-core').count({
      user: userId,
    })
    return userGroup >= totalGroup
  },
}
