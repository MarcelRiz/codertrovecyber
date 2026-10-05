'use strict';

/**
 * A set of functions called "actions" for `admin`
 */

module.exports = {
  dashboardSummary: async (ctx, next) => {
    try {
      return strapi.services['admin-zone'].dashboardSummary()
    } catch (err) {
      ctx.body = err;
    }
  }
};
