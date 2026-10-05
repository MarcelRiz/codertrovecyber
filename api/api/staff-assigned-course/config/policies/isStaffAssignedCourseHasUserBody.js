'use strict';

module.exports = async (ctx, next) => {
  const { user } = ctx.request.body
  if (!user) {
    return ctx.forbidden('User is is required');
  }
  ctx.state.userId = user
  return next()
};
