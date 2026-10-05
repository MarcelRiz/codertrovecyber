'use strict'

const ResponseHelper = require('../../../helpers/ResponseHelper')
const EmailHelper = require('../../../helpers/EmailHelper')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async submit(ctx) {
    const { responseId, groupId } = ctx.request.body
    const userId = ctx.state.user.id

    const userData = await strapi.query('user', 'users-permissions').findOne(
      {
        id: userId,
      },
      ['companies']
    )

    const [questions, { answers }, actionItems] = await Promise.all([
      /** Get question from typeform */
      strapi.services.assessment.getAssessmentQuestion({
        ctx,
        groupId,
      }),

      /** Get user answer from typeform */
      strapi.services.assessment.getAssessmentResponse({
        ctx,
        responseId,
        groupId,
      }),

      /** Get all action item */
      strapi.services['action-item'].find(),
    ])

    const pendingAT = await strapi.services['action-item'].getPendingActionItem({
      actionItems,
      answers,
      questions,
    })

    await Promise.all([
      /** Update action item for user */
      strapi.services['action-item'].updateUserActionItem({
        userId,
        pendingActionItems: pendingAT,
      }),

      /** Mark user has comppleted this question group */
      strapi.query('user-question-group', 'cnc-core').create({
        typeformResponseId: responseId,
        questionGroup: groupId,
        user: userId,
        company: userData?.companies[0]?.id,
      }),
    ])

    if (await strapi.services.assessment.isCompletedAssessment(userId)) {
      await strapi.query('user', 'users-permissions').update(
        {
          id: userId,
        },
        {
          assessmentCompleted: true,
        }
      )

      await strapi.services['security-rating'].calculateSecurityRatingOfCompany({
        userId,
        companyId: userData?.companies[0]?.id,
      })
      const user = await strapi.query('user', 'users-permissions').findOne({
        id: userId,
      })
      EmailHelper.sendCompletedAssessmentEmail(user)
    }

    return ResponseHelper.successAction(ctx)
  },
}
