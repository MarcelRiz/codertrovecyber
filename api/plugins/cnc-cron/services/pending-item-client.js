'use strict'

const EmailHelper = require('../../../helpers/EmailHelper')

const handler = async (log) => {
  const knex = strapi.connections.default
  const userAT = await knex('user_action_items')
    .select('user as id', 'user_action_items.state', 'email', 'lastName', 'firstName')
    .count('* as pendingActionItems')
    .groupBy('user', 'user_action_items.state', 'email', 'lastName', 'firstName')
    .join('users-permissions_user', 'user_action_items.user', 'users-permissions_user.id')
    .where('user_action_items.state', 'unresolved')

  const { pendingUsers: pendingClients } = await strapi.plugins['cnc-cron'].services[
    'pending-course-policy'
  ].get('client')

  await Promise.all(
    userAT.map((item) => {
      let pendingClient = pendingClients.find((client) => client.id == item.id)
      if (!pendingClient) {
        return pendingClients.push({
          ...item,
          role: { type: 'client' },
          pendingCourses: 0,
          pendingPolicies: 0,
        })
      }
      return (pendingClient.pendingActionItems = item.pendingActionItems)
    })
  )

  pendingClients = pendingClients.map((client) => ({
    ...client,
    pendingCourses: client.pendingCourses || 0,
    pendingPolicies: client.pendingPolicies || 0,
  }))

  pendingClients = pendingClients.filter(
    (client) => client.pendingCourses > 0 || client.pendingPolicies > 0
  )

  pendingClients.map((client) => {
    EmailHelper.sendPendingItemEmail({
      ...client,
      pendingCourses: client.pendingCourses,
      pendingPolicies: client.pendingPolicies,
    })
  })

  log({
    pendingClients,
  })
}

module.exports = {
  defaultRepeat: 'every2Week',
  handler,
}
