'use strict'

const { getAnswerValue } = require('../../../helpers/TypeformHelper')
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getPendingActionItem({ actionItems, answers, questions }) {
    const pendingAT = []

    await Promise.all(
      questions.map(async (question) => {
        console.log('Ref:', question.ref)

        const actionItem = actionItems.find((actionItem) =>
          actionItem.questionReferenceID.includes(question.ref)
        )

        if (!actionItem) {
          console.log('Action Item not found')
          console.log('----------------------')
          return
        }

        let pendingATItem = {
          id: actionItem.id,
          category: actionItem.category,
          state: 'unresolved',
          controlMapping: actionItem.controlMapping,
        }
        const answer = answers.find((answer) => answer.field.ref == question.ref)

        if (!answer) {
          console.log('Answer not found. Add RESOLVED action item')
          return pendingAT.push(pendingATItem)
        }

        const answerValue = getAnswerValue(answer)
        let { goodChoices } = actionItem

        console.log('Good Choices:', goodChoices)
        console.log('User response:', answerValue)
        console.log(
          `Add ${goodChoices.includes(answerValue) ? 'RESOLVED' : 'UNRESOLVED'} action item: `
        )
        console.log('------------------------')

        goodChoices.includes(answerValue) && (pendingATItem.state = 'resolved')

        return pendingAT.push(pendingATItem)
      })
    )
    return pendingAT
  },

  async updateUserActionItem({ userId, pendingActionItems }) {
    const user = await strapi.query('user', 'users-permissions').findOne(
      {
        id: userId,
      },
      ['companies']
    )
    pendingActionItems.map((item) => {
      strapi.query('user-action-item', 'cnc-core').create({
        actionItem: item.id,
        user: userId,
        company: user?.companies[0]?.id,
        category: item.category,
        state: item.state,
        controlMapping: item.controlMapping,
      })
    })
  },

  async getTotalActionItem(data) {
    const queryCAT = {
      user: data.userId,
    }
    const [
      totalAT,
      totalPeopleAT,
      totalProcessAT,
      totalTechAT,
      totalStandardAT,
      totalCAT,
      totalPeopleCAT,
      totalProcessCAT,
      totalTechCAT,
      totalStandardCAT,
    ] = await Promise.all([
      strapi.services['action-item'].count(),
      strapi.services['action-item'].count({
        category: 'People',
      }),
      strapi.services['action-item'].count({
        category: 'Process',
      }),
      strapi.services['action-item'].count({
        category: 'Technology',
      }),
      strapi.services['action-item'].count({
        controlMapping_nin: [''],
      }),

      strapi.services['custom-action-item'].count(queryCAT),
      strapi.services['custom-action-item'].count({
        ...queryCAT,
        category: 'People',
      }),
      strapi.services['custom-action-item'].count({
        ...queryCAT,
        category: 'Process',
      }),
      strapi.services['custom-action-item'].count({
        ...queryCAT,
        category: 'Technology',
      }),
      strapi.services['custom-action-item'].count({
        ...queryCAT,
        controlMapping_nin: [''],
      }),
    ])

    return {
      total: totalAT + totalCAT,
      totalPeople: totalPeopleAT + totalPeopleCAT,
      totalProcess: totalProcessAT + totalProcessCAT,
      totalTech: totalTechAT + totalTechCAT,
      totalStandard: totalStandardAT + totalStandardCAT,
    }
  },

  async getTotalPendingActionItem(data) {
    const { userId, companyId } = data
    const query = {
      state: 'unresolved',
    }
    if (userId) {
      Object.assign(query, { user: userId })
    }
    if (companyId) {
      Object.assign(query, { company: companyId })
    }
    const [
      totalPending,
      totalPeoplePending,
      totalProcessPending,
      totalTechPending,
      totalStandardPending,
    ] = await Promise.all([
      strapi.query('user-action-item', 'cnc-core').count(query),
      strapi.query('user-action-item', 'cnc-core').count({
        category: 'People',
        ...query,
      }),
      strapi.query('user-action-item', 'cnc-core').count({
        category: 'Process',
        ...query,
      }),
      strapi.query('user-action-item', 'cnc-core').count({
        category: 'Technology',
        ...query,
      }),
      strapi.query('user-action-item', 'cnc-core').count({
        controlMapping_nin: [''],
        ...query,
      }),
    ])
    return {
      totalPending,
      totalPeoplePending,
      totalProcessPending,
      totalTechPending,
      totalStandardPending,
    }
  },
}
