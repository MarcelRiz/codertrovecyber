'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterDelete(data) {
      console.log('Trigger afterDelete custom-action-item model')
      console.log(data)
      const user = data.userActionItems[0]?.user

      await Promise.all(
        data.userActionItems.map(async ({ id }) => {
          await strapi.query('user-action-item', 'cnc-core').delete({
            id,
          })
        })
      )

      if (user) {
        console.log('update security rating')
        await strapi.services['security-rating'].calculateSecurityRating(user)
      }
    },
  },
}
