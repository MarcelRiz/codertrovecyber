'use strict'

const adminRoles = ['strapi-super-admin', 'strapi-editor', 'strapi-author']
const isAdmin = (ctx, next, isIncluding = false) => {
  // strapi admin
  if (ctx.state.user?.roles?.some((x) => adminRoles.includes(x.code))) {
    return next()
  }

  // user type admin
  const roleType = ctx.state.user.role ? ctx.state.user.role.type : null
  if (roleType === 'admin') {
    return next()
  }

  if (isIncluding) {
    throw new Error(`You're not allowed to perform this action!`)
  } else {
    return ctx.unauthorized()
  }
}

module.exports = isAdmin
