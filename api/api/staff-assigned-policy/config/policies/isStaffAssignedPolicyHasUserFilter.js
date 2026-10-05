'use strict';

module.exports = async (ctx, next) => {
  const { user } = ctx.query
  if (!user) {
    return ctx.forbidden('User filter is required');
  }
  ctx.state.userId = user
  return next()
};
