'use strict';

const isAdmin = require("../../../../extensions/users-permissions/config/policies/isAdmin");

module.exports = async (ctx, next) => {
  try {
    return isAdmin(ctx, next, true);
  } catch (e) {
    const { user, staffAssignedCourseId } = ctx.state

    if (!staffAssignedCourseId) {
      return ctx.forbidden("Staff assigned course id is required");
    }

    const staffAssignedCourse = await strapi.query('staff-assigned-course').findOne({
      user: user.id,
      id: staffAssignedCourseId
    })

    if (!staffAssignedCourse) {
      return ctx.forbidden("You don't have permission to access this staff assigned course");
    }

    return await next()
  }
};
