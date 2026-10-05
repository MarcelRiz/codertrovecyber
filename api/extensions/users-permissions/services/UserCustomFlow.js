'use strict'

module.exports = {
  async countAttemptLogin(userId) {
    const limitAttempt = strapi.plugins['users-permissions'].config.limitAttemptLogin
    const user = await strapi.query('user', 'users-permissions').findOne({
      id: userId,
    })
    const update = {
      attempLogin: +user.attempLogin + 1,
    }
    update.attempLogin >= limitAttempt && (update.blocked = true)

    await strapi.query('user', 'users-permissions').update(
      {
        id: userId,
      },
      update
    )
  },

  async resetAttemptLogin(userId) {
    await strapi.query('user', 'users-permissions').update(
      {
        id: userId,
      },
      {
        attempLogin: 0,
      }
    )
  },
}
