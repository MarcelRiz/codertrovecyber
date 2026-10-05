'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async ctx => {
    try {
      const { user } = ctx.state;
      const companyPolicy = await strapi.services['company-policy'].create({
        user, ...ctx.request.body
      })
      ctx.body = companyPolicy
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },

  generateCyberPolicies: async ctx => {
    const { companyId } = ctx.params;
    const { policyTemplateIds, owner } = ctx.request.body;
    const { user } = ctx.state;
    const company = await strapi.services.company.findOne({ id: companyId })
    if (!company) {
      return ctx.badRequest('Company not found');
    }
    if (!policyTemplateIds || !policyTemplateIds.length) {
      return ctx.badRequest('Policy templates is required');
    }
    if (!owner) {
      return ctx.badRequest('Owner is required');
    }
    const policies = await strapi.services['company-policy'].generateCyberPolicies({
      company,
      policyTemplateIds,
      owner,
      author: user
    })

    // hide relation fields
    return policies.map(entity => sanitizeEntity(entity, { model: strapi.models['company-policy'] }));
  },

  download: async ctx => {
    const { id } = ctx.params;
    try {
      const { name, stream } = await strapi.services['company-policy'].download({
        id
      })
      ctx.set('Content-Disposition', `attachment; filename="${name}"`);
      ctx.body = stream;
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  preview: async ctx => {
    const { companyId, policyTemplateId, owner } = ctx.request.body;
    try {
      const { name, stream } = await strapi.services['company-policy'].preview({
        companyId, policyTemplateId, owner
      })
      ctx.set('Content-Disposition', `attachment; filename="${name}"`);
      ctx.body = stream;
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  update: async ctx => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    try {
      const data = await strapi.services['company-policy'].update({
        user, id, ...ctx.request.body
      })
      ctx.body = data
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  find: async ctx => {
    const { user } = ctx.state;
    try {
      const data = await strapi.services['company-policy'].find({
        user, ...ctx.request.query
      })
      ctx.body = data
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },
};
