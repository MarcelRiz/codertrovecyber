'use strict';

const isAdmin = require("../../../../extensions/users-permissions/config/policies/isAdmin");

module.exports = async (ctx, next) => {
  try {
    return isAdmin(ctx, next, true);
  } catch (e) {
    const { user, companyId } = ctx.state
    if (!companyId) {
      return ctx.forbidden("Company id is required");
    }
    const company = await strapi.query('company').findOne({
      users: user.id,
      id: companyId
    })
    if (!company) {
      return ctx.forbidden("You don't have permission on that company");
    }
    ctx.state.company = company
    return await next();
  }
};
