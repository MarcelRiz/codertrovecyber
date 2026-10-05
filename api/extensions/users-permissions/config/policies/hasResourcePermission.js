'use strict'

const ResponseHelper = require('../../../../helpers/ResponseHelper')

module.exports = async (ctx, next) => {
  /** Allow update self resource */
  if (!+ctx.params.id) ctx.params.id = ctx.state.user.id
  if (ctx.state.user.id == ctx.params.id) return await next()

  const role = ctx.state.user.role ? ctx.state.user.role.type : null

  /** Update another resource flow */

  /** Admin has full permission */
  if (role == 'admin') return await next()
  /** Admin can modify staffs */
  if (role === 'client') return await next()
  /** Not allow staff update another one */
  if (role == 'staff') return ResponseHelper.illegal(ctx)

  // const user = await strapi.query('user', 'users-permissions').findOne({ id: ctx.params.id })

  /** Find if Staff belongs to Client */
  // const parent = user.parents.find((parent) => parent.id == ctx.state.user.id)

  /** Client can modify any Staff include itself company */

  /** Client can update itself Staff */
  // if (resourceRole == 'staff' && parent) return await next()

  return ResponseHelper.illegal(ctx)
}
