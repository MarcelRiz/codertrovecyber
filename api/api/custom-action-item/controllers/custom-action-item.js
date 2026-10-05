'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const params = ctx.request.body
    const userATConfig = strapi.plugins['cnc-core'].config.userActionItem
    const { id: userATId } = await strapi.query('user-action-item', 'cnc-core').create({
      user: params.userId,
      state: userATConfig.state.UNRESOLVED,
      type: userATConfig.type.CUSTOM_ACTION_ITEM,
      category: params.category,
    })
    const customAT = await strapi.services['custom-action-item'].create({
      ...params,
      user: params.userId,
      userActionItems: [userATId],
    })

    await strapi.services['security-rating'].calculateSecurityRating(params.userId)
    return customAT
  },
}
