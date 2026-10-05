'use strict';

module.exports = async (ctx, next) => {
  const { company } = ctx.request.body
  if (!company) {
    return ctx.forbidden('Company is is required');
  }
  ctx.state.companyId = company
  return next()
};
