'use strict'

module.exports = async (ctx, next) => {
  const advancedUser = ['client', 'admin']
  const roleType = ctx.state.user.role ? ctx.state.user.role.type : null
  if (!advancedUser.includes(roleType)) {
    return ctx.unauthorized()
  }

  await next()
}
