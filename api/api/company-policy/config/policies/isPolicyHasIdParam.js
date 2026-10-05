'use strict';

module.exports = async (ctx, next) => {
  const { id } = ctx.params
  if (!id) {
    return ctx.forbidden('Company policy id is required');
  }
  ctx.state.companyPolicyId = id
  return next()
};
