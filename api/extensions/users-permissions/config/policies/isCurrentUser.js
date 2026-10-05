'use strict';

const isAdmin = require("./isAdmin");

module.exports = async (ctx, next) => {
  try {
    return isAdmin(ctx, next, true);
  } catch (e) {
    const { user, userId } = ctx.state
    if (!userId) {
      return ctx.forbidden("User id is required");
    }

    if (user.id.toString() !== userId.toString()) {
      return ctx.forbidden("You don't have permission on that user");
    }
    return await next();
  }
};
