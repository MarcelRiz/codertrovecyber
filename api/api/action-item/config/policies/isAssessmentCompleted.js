'use strict'

const ResponseHelper = require('../../../../helpers/ResponseHelper')

module.exports = async (ctx, next) => {
  const assessmentCompleted = ctx.state.user.assessmentCompleted
  if (assessmentCompleted) {
    return ResponseHelper.illegal(ctx, {
      msg: 'Your Assessment has been completed already',
    })
  }

  await next()
}
