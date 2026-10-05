'use strict'

const { sanitizeEntity } = require('strapi-utils/lib')
const _ = require('lodash')
const platform = require('platform')
const EmailHelper = require('../../../helpers/EmailHelper')
/**
 * cnc-core.js controller
 *
 * @description: A set of functions called "actions" of the `cnc-core` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
    // return strapi.plugins['cnc-core'].externals.typeform.getAssessmentForm()
    const user = await strapi.query('user', 'users-permissions').findOne({ id: ctx.query.id })
    console.log(user)
    const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: user.id })
    return {
      jwt,
      ...sanitizeEntity(user, {
        model: strapi.query('user', 'users-permissions').model,
      }),
    }

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    })
  },
  index1: async (ctx) => {
    return strapi.plugins['cnc-core'].externals.typeform.getAssessmentResponse({
      formId: 'WMtSxmbU',
      responseId: 'y4o5d868ezlshwy5y4o9abyqzuelm50y',
    })

    const user = await strapi.query('user', 'users-permissions').findOne({ id: 1 })
    const report = await strapi.query('report').findOne({ id: 2 })
    const data = {
      ...user,
      pendingCourses: 2,
      pendingPolicies: 6,
      pendingActionItem: 5,
    }
    return EmailHelper.sendPendingItemEmail(data)
    return strapi.plugins['cnc-cron'].services['pending-course-policy'].handler()

    return strapi.services['security-rating']
      .calculateSecurityRating(1)
      .catch((err) => console.log(err))
  },

  index2: async (ctx) => {
    return strapi.services['action-item'].count({
      controlMapping_nin: [''],
    })

    return strapi.plugins['cnc-cron'].services['pending-item-staff'].handler(() => {})
    let [fields, responses, { answers }] = await Promise.all([
      strapi.plugins['cnc-core'].externals.typeform.getAssessmentForm({
        formId: 'WMtSxmbU',
      }),

      strapi.plugins['cnc-core'].externals.typeform.getAssessmentResponseList({
        formId: 'WMtSxmbU',
      }),

      strapi.plugins['cnc-core'].externals.typeform.getAssessmentResponse({
        formId: 'yjQK73dO',
        responseId: 'a5pwcyt4u373tpx93a5pwcyuur451n84',
      }),
    ])

    // let questions = []
    // fields.map((item) => {
    //   const question = item.type == 'group' ? item.properties?.fields : [item]
    //   questions = [...questions, ...question]
    // })
    return responses

    fields = _.map(fields, _.partialRight(_.pick, ['id', 'title', 'ref', 'type']))
    // return answers
    return _.values(_.merge(_.keyBy(fields, 'id'), _.keyBy(answers, 'field.id')))

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    })
  },
}
