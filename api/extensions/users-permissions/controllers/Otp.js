'use strict'

const { emailRegExp } = require('./Auth')
const EmailHelper = require('../../../helpers/EmailHelper')
const ResponseHelper = require('../../../helpers/ResponseHelper')
const QueryHelper = require('../../../helpers/QueryHelper')
const GeneratorHelper = require('../../../helpers/GeneratorHelper')

module.exports = {
  async request(ctx) {
    try {
      const params = ctx.request.body

      /** The identifier is required.*/
      if (!params.identifier) {
        return ResponseHelper.missingParam(ctx, {
          field: 'username or email',
        })
      }

      /** The password is required.*/
      if (!params.password) {
        return ResponseHelper.missingParam(ctx, {
          field: 'password',
        })
      }

      /** Check if the provided identifier is an email or not.*/
      const isEmail = emailRegExp.test(params.identifier)

      const query = {}

      /** Set the identifier to the appropriate query field.*/
      if (isEmail) {
        query.email = params.identifier.toLowerCase()
      } else {
        query.username = params.identifier
      }

      /** Check if the user exists.*/
      // const user = await strapi.query('user', 'users-permissions').findOne(query)
      const user = await QueryHelper.findOneOrError(ctx, {
        name: 'Email or password',
        source: ['user', 'users-permissions'],
        query,
      })

      if (user.periodEnd && new Date(user.periodEnd).getTime() < new Date().getTime()) {
        return ctx.locked(
          'Your subscription was canceled. Please resubscribe to access your account again'
        )
      }

      if (user.blocked === true) {
        return ctx.locked('Your account has been blocked by an administrator')
      }

      const validPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password)

      if (!validPassword) {
        await strapi.plugins['users-permissions'].services['usercustomflow'].countAttemptLogin(
          user.id
        )
        ctx.track?.error(400, 'Password invalid', user.id)
        return ResponseHelper.invalidField(ctx, {
          field: 'Email or password',
        })
      }

      const otp = GeneratorHelper.otp()

      /** Update user otp */
      await strapi.plugins['cnc-core'].services['code-generated-log'].generate({
        userId: user.id,
        type: 'otp',
        value: otp,
      })

      /** Send OTP email */
      EmailHelper.sendOtpEmail({
        otp,
        user,
      })

      ctx.track?.success(user.id)
      /** Response */
      ctx.send({
        success: true,
      })
    } catch (error) {
      ctx.badRequest('Email or password is invalid.')
    }
  },
}
