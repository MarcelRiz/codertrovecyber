'use strict';

module.exports = async (ctx, next) => {
  const { company } = ctx.query
  if (!company) {
    return ctx.forbidden('Company filter is required');
  }
  ctx.state.companyId = company
  return next()
};
