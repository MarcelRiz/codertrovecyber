'use strict';

module.exports = async (ctx, next) => {
  const { id } = ctx.params
  if (!id) {
    return ctx.forbidden('Staff assigned policy id is required');
  }
  ctx.state.staffAssignedPolicyId = id
  return next()
};
