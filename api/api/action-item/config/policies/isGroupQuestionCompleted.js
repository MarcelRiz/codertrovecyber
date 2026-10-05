'use strict'

const ResponseHelper = require('../../../../helpers/ResponseHelper')

module.exports = async (ctx, next) => {
  const groupId = ctx.request.body.groupId
  const userId = ctx.state.user.id

  const userQuestionGroup = await strapi.query('user-question-group', 'cnc-core').findOne(
    {
      questionGroup: groupId,
      user: userId,
    },
    []
  )

  if (userQuestionGroup) {
    return ResponseHelper.illegal(ctx, {
      msg: 'You have completed this assessment group already',
    })
  }

  await next()
}
