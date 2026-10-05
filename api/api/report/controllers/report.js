'use strict'
const { parseMultipartData, sanitizeEntity } = require('strapi-utils')
const EmailHelper = require('../../../helpers/EmailHelper')

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx)
      entity = await strapi.services.report.create(data, { files })
    } else {
      entity = await strapi.services.report.create(ctx.request.body)
    }

    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ id: ctx.request.body.user })

    EmailHelper.sendActionReportEmail(user, entity)
    return sanitizeEntity(entity, { model: strapi.models.report })
  },
}
