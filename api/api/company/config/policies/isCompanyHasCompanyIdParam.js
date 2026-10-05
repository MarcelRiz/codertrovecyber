'use strict';

module.exports = async (ctx, next) => {
  const { companyId } = ctx.params
  if (!companyId) {
    return ctx.forbidden('Company Id is required');
  }
  ctx.state.companyId = companyId
  return next()
};
