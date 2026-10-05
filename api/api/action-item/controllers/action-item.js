'use strict'

const QueryHelper = require('../../../helpers/QueryHelper')
const ResponseHelper = require('../../../helpers/ResponseHelper')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async done(ctx) {
    await strapi.query('user-action-item', 'cnc-core').update(
      {
        id: ctx.params.id,
      },
      {
        state: 'resolved',
      }
    )

    const userId = ctx.state.user.id
    const userData = await strapi.query('user', 'users-permissions').findOne(
      {
        id: userId,
      },
      ['companies']
    )

    await strapi.services['security-rating'].calculateSecurityRatingOfCompany({
      userId,
      companyId: userData?.companies[0]?.id,
    })
    return ResponseHelper.successAction(ctx)
  },
}
