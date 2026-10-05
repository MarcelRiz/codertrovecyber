'use strict'

module.exports = async (ctx, next) => {
  const roleType = ctx.state.user.role ? ctx.state.user.role.type : null
  if (roleType != 'client') {
    return ctx.unauthorized()
  }

  await next()
}
