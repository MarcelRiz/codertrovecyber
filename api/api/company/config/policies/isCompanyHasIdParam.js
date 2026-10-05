'use strict';

module.exports = async (ctx, next) => {
  const { id } = ctx.params
  if (!id) {
    return ctx.forbidden('Company Id is required');
  }
  ctx.state.companyId = id
  return next()
};
