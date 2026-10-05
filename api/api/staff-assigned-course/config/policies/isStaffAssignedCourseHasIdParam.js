'use strict';

module.exports = async (ctx, next) => {
  const { id } = ctx.params
  if (!id) {
    return ctx.forbidden('Staff assigned course id is required');
  }
  ctx.state.staffAssignedCourseId = id
  return next()
};
