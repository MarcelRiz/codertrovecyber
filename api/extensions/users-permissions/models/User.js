'use strict'

/**
 * Lifecycle callbacks for the `User` model.
 */

module.exports = {
  lifecycles: {
    async beforeDelete(data) {
      console.log('Trigger beforeDelete user model')
      console.log(data)
      const user = await strapi.query('user', 'users-permissions').findOne({
        id: data.id,
      })
      console.log(user)
      console.log('delete', user.email)

      const query = {
        user: user.id,
      }

      await Promise.all([
        strapi.query('security-rating').delete(query),
        strapi.query('user-action-item', 'cnc-core').delete(query),
        strapi.query('code-generated-log', 'cnc-core').delete(query),
        strapi.query('staff-assigned-course').delete(query),
        strapi.query('staff-assigned-policy').delete(query),
        strapi.query('user-question-group', 'cnc-core').delete(query),
        strapi.query('activity-tracking', 'cnc-core').delete(query),
        strapi.query('report').delete(query),
      ])

      user.children.map((child) => {
        strapi.query('user', 'users-permissions').delete({
          id: child.id,
        })
      })
    },
  },
}
