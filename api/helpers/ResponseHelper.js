const { capitalize } = require('lodash')

const showMsg = (original, { msg } = {}) => msg || original

module.exports = {
  successAction(ctx, msg) {
    return ctx.send({
      statusCode: 200,
      message: msg || 'success',
    })
  },

  invalidField(ctx, { field, ...others }) {
    return ctx.badRequest(showMsg(`${capitalize(field)} is invalid`, others))
  },

  incorrectField(ctx, { field, ...others }) {
    return ctx.badRequest(showMsg(`${capitalize(field)} is incorrect`, others))
  },

  missingParam(ctx, { field, ...others }) {
    return ctx.badRequest(showMsg(`Please provide ${field}`, others))
  },

  notFound(ctx, { field, ...others }) {
    return ctx.notFound(showMsg(`${capitalize(field)} not found`, others))
  },

  illegal(ctx, others) {
    return ctx.illegal(showMsg('You are not permitted to access this resource', others))
  },
}
