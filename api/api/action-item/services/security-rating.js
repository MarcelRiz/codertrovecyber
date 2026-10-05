'use strict'

const CalculationHelper = require('../../../helpers/CalculationHelper')
const QueryHelper = require('../../../helpers/QueryHelper')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async calculateSecurityRating(userId) {
    const { total, totalPeople, totalProcess, totalTech, totalStandard } = await strapi.services[
      'action-item'
    ].getTotalActionItem({ userId })

    const {
      totalPending,
      totalPeoplePending,
      totalProcessPending,
      totalTechPending,
      totalStandardPending,
    } = await strapi.services['action-item'].getTotalPendingActionItem({ userId })

    console.log('Total:', `${total - totalPending} / ${total}`)
    console.log('Total People:', `${totalPeople - totalPeoplePending} / ${totalPeople}`)
    console.log('Total Process:', `${totalProcess - totalProcessPending} / ${totalProcess}`)
    console.log('Total Tech:', `${totalTech - totalTechPending} / ${totalTech}`)
    console.log('Total Standard:', `${totalStandard - totalStandardPending} / ${totalStandard}`)

    const result = {
      company: CalculationHelper.percent(total, total - totalPending),
      people: CalculationHelper.percent(totalPeople, totalPeople - totalPeoplePending),
      process: CalculationHelper.percent(totalProcess, totalProcess - totalProcessPending),
      technology: CalculationHelper.percent(totalTech, totalTech - totalTechPending),
      standard: CalculationHelper.percent(totalStandard, totalStandard - totalStandardPending),
      industry: await this.getIndustryRating(userId),
      user: userId,
    }
    console.log(result)

    const { id } = await QueryHelper.findOrCreate({
      source: ['security-rating'],
      query: {
        user: userId,
      },
    })

    await strapi.query('security-rating').update(
      {
        id,
      },
      result
    )
  },

  async calculateSecurityRatingOfCompany(req) {
    const { userId, companyId } = req
    const { total, totalPeople, totalProcess, totalTech, totalStandard } = await strapi.services[
      'action-item'
    ].getTotalActionItem({ companyId })

    const {
      totalPending,
      totalPeoplePending,
      totalProcessPending,
      totalTechPending,
      totalStandardPending,
    } = await strapi.services['action-item'].getTotalPendingActionItem({ companyId })

    console.log('Total:', `${total - totalPending} / ${total}`)
    console.log('Total People:', `${totalPeople - totalPeoplePending} / ${totalPeople}`)
    console.log('Total Process:', `${totalProcess - totalProcessPending} / ${totalProcess}`)
    console.log('Total Tech:', `${totalTech - totalTechPending} / ${totalTech}`)
    console.log('Total Standard:', `${totalStandard - totalStandardPending} / ${totalStandard}`)

    const result = {
      company: CalculationHelper.percent(total, total - totalPending),
      people: CalculationHelper.percent(totalPeople, totalPeople - totalPeoplePending),
      process: CalculationHelper.percent(totalProcess, totalProcess - totalProcessPending),
      technology: CalculationHelper.percent(totalTech, totalTech - totalTechPending),
      standard: CalculationHelper.percent(totalStandard, totalStandard - totalStandardPending),
      industry: await this.getIndustryRating(userId),
      user: userId,
    }
    console.log(result)

    const { id } = await QueryHelper.findOrCreate({
      source: ['security-rating'],
      query: {
        companyId: companyId,
      },
    })

    await strapi.query('security-rating').update(
      {
        id,
      },
      result
    )
  },

  async getIndustryRating(userId) {
    const user = await strapi.query('user', 'users-permissions').findOne(
      {
        id: userId,
      },
      ['companies.industry']
    )
    return user?.companies[0]?.industry?.rating
  },
}
