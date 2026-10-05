'use strict'

const QueryHelper = require('../../../../helpers/QueryHelper')
const ResponseHelper = require('../../../../helpers/ResponseHelper')

// custom policies - isOwnedActionItem
module.exports = async (ctx, next) => {
  const user = await QueryHelper.findOneOrError(ctx, {
    name: 'User',
    source: ['user', 'users-permissions'],
    query: { id: ctx.state.user.id },
  })

  const userAT = user.userActionItems

  if (!userAT) {
    return ResponseHelper.notFound(ctx, {
      msg: 'User does not have any action item',
    })
  }

  const actionItem = userAT.find((item) => item.id == ctx.params.id)

  if (!actionItem) {
    return ResponseHelper.notFound(ctx, {
      msg: 'User does not have this action item',
    })
  }

  if (actionItem.state == 'resolve') {
    return ResponseHelper.invalidField(ctx, {
      msg: 'This user action item had been resolved',
    })
  }

  await next()
}
