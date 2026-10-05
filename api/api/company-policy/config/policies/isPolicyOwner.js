'use strict';

const isAdmin = require("../../../../extensions/users-permissions/config/policies/isAdmin");

/**
 * `isCompanyUser` policy.
 */

module.exports = async (ctx, next) => {
  try {
    return isAdmin(ctx, next, true);
  } catch (e) {
    const { user, companyPolicyId } = ctx.state

    if (!companyPolicyId) {
      return ctx.forbidden("Company policy id is required");
    }
    const companies = await strapi.query('company').find({
      users: user.id,
    })

    if (!companies?.length) {
      return ctx.forbidden("You don't have any company");
    }

    const companyIds = companies.map(x => x.id)

    const companyPolicy = await strapi.query('company-policy').findOne({
      company: companyIds,
      id: companyPolicyId
    })

    if (!companyPolicy) {
      return ctx.forbidden("You don't have permission to access this policy");
    }

    return await next()
  }
};
