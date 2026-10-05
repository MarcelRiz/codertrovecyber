'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeDelete(result) {
      if (result?.id) {
        await strapi.query('staff-assigned-policy').delete({
          companyPolicy: result.id
        })
      }
    },
  },
};
