'use strict';

const isAdmin = require("../../../../extensions/users-permissions/config/policies/isAdmin");

module.exports = async (ctx, next) => {
  try {
    return isAdmin(ctx, next, true);
  } catch (e) {
    const { user, staffAssignedPolicyId } = ctx.state

    if (!staffAssignedPolicyId) {
      return ctx.forbidden("Staff assigned policy id is required");
    }

    const staffAssignedPolicy = await strapi.query('staff-assigned-policy').findOne({
      user: user.id,
      id: staffAssignedPolicyId
    })

    if (!staffAssignedPolicy) {
      return ctx.forbidden("You don't have permission to access this staff assigned policy");
    }

    return await next()
  }
};
