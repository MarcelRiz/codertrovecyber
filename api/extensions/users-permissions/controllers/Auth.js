'use strict'

/**
 * Auth.js controller
 *
 * @description: A set of functions called "actions" for managing `Auth`.
 */

/* eslint-disable no-useless-escape */
const crypto = require('crypto')
const _ = require('lodash')
const grant = require('grant-koa')
const axios = require('axios')
const https = require('https')
const { sanitizeEntity } = require('strapi-utils')
const EmailHelper = require('../../../helpers/EmailHelper')
const QueryHelper = require('../../../helpers/QueryHelper')
const SlackHelper = require('../../../helpers/SlackHelper')
const GeneratorHelper = require('../../../helpers/GeneratorHelper')
const ResponseHelper = require('../../../helpers/ResponseHelper')
const StripeHelper = require('../../../helpers/StripeHelper')

const emailRegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
]

const vulnerabilityHost = `${strapi.config.server.otherServices.vulnerabilityWorker}/api/manageScanning`

const register = async (ctx) => {
  const pluginStore = await strapi.store({
    environment: '',
    type: 'plugin',
    name: 'users-permissions',
  })

  const settings = await pluginStore.get({
    key: 'advanced',
  })

  if (!settings.allow_register) {
    return ctx.badRequest('Register action is currently disabled.')
  }

  const params = {
    ..._.omit(ctx.request.body, [
      'confirmed',
      'confirmationToken',
      'resetPasswordToken',
      'otp',
      'children',
      'blocked',
    ]),
    provider: 'local',
  }

  // Email is required.
  if (!params.email) {
    return ctx.badRequest('Please provide your email.')
  }

  // Auto generate password
  const { original, hash } = await GeneratorHelper.password()

  params.password = hash

  // Throw an error if the password selected by the user
  // contains more than three times the symbol '$'.
  // if (strapi.plugins['users-permissions'].services.user.isHashed(params.password)) {
  //   return ctx.badRequest('Your password cannot contain more than three times the symbol `$`.')
  // }

  // Check if the provided email is valid or not.
  const isEmail = emailRegExp.test(params.email)

  if (isEmail) {
    params.email = params.email.toLowerCase()
  } else {
    return ctx.badRequest('Please provide valid email address.')
  }

  // params.password = await strapi.plugins['users-permissions'].services.user.hashPassword(params)

  const user = await strapi.query('user', 'users-permissions').findOne({
    email: params.email,
  })

  if (user && user.provider === params.provider) {
    return ctx.badRequest('Email is already taken.')
  }

  if (user && user.provider !== params.provider && settings.unique_email) {
    return ctx.badRequest('Email is already taken.')
  }

  // Set role
  const role = await strapi
    .query('role', 'users-permissions')
    .findOne({ type: params.roleType }, [])

  params.role = role.id
  params.username = params.email

  try {
    if (!settings.email_confirmation) {
      params.confirmed = true
    }

    const user = await strapi.query('user', 'users-permissions').create(params)

    const sanitizedUser = sanitizeEntity(user, {
      model: strapi.query('user', 'users-permissions').model,
    })

    if (settings.email_confirmation) {
      try {
        await strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(user)
      } catch (err) {
        return ctx.badRequest(null, err)
      }

      return ctx.send({ user: sanitizedUser })
    }

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue(_.pick(user, ['id']))

    /** Email Welcome */
    EmailHelper.sendWelcomeEmail({
      ...user,
      password: original,
    })

    if (user) {
      const hostPhish = process.env.GOPHISH_HOST
      const apiKeyPhish = process.env.GOPHISH_API_KEY
      const dataRequest = {
        role: 'user',
        username: ctx.request.body.email,
        password: original || '123',
      }
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyPhish}`,
        },
      }

      if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        })
        Object.assign(options, {
          httpsAgent: agent,
        })
      }

      const responsePhish = await axios
        .post(`${hostPhish}/api/users/`, dataRequest, options)
        .catch((error) => {
          console.log(`\n Request Gophish error ${error} \n`)
          SlackHelper.sendSlackNotification({
            text: `[${process.env.PLATFORM_NAME}] Error: Create a gophish user ${user.email} failed on ${process.env.ENVIRONMENT}`,
          })
        })

      if (responsePhish && responsePhish.data) {
        await strapi.query('user', 'users-permissions').update(
          { id: user.id },
          {
            gophishApiKey: responsePhish.data.api_key,
            gophishUserId: responsePhish.data.id,
          }
        )
      }
    }

    return ctx.send({
      jwt,
      user: sanitizedUser,
    })
  } catch (err) {
    console.log(err)
    console.log(`\n \n  ERROR ${err.message} \n`)
    const adminError = _.includes(err.message, 'username') ? 'Username already taken' : err.message

    ctx.badRequest(adminError)
  }
}

const selfRegister = async (ctx) => {
  const params = {
    ..._.omit(ctx.request.body, [
      'confirmed',
      'confirmationToken',
      'resetPasswordToken',
      'otp',
      'children',
      'blocked',
    ]),
    provider: 'local',
  }

  if (!params.email) {
    return ctx.badRequest('Please provide your email.')
  }

  if (!params.originalPassword) {
    return ctx.badRequest('Please provide your password.')
  }

  const isEmail = emailRegExp.test(params.email)

  if (isEmail) {
    params.email = params.email.toLowerCase()
  } else {
    return ctx.badRequest('Please provide valid email address.')
  }

  const user = await strapi.query('user', 'users-permissions').findOne({
    email: params.email,
  })

  if (user && user.provider === params.provider) {
    return ctx.badRequest('The email is being used, please use another one.')
  }

  const hash = await strapi.plugins['users-permissions'].services.user.hashPassword({
    password: params.originalPassword,
  })

  // Set role
  const role = await strapi
    .query('role', 'users-permissions')
    .findOne({ type: params.roleType }, [])

  params.role = role.id
  params.username = params.email
  params.password = hash

  try {
    const user = await strapi.query('user', 'users-permissions').create(params)

    if (params.checkoutSessionId) {
      const stripeSession = await strapi.query('payment-stripe-session').update(
        { sessionId: params.checkoutSessionId },
        {
          hasCreatedAccount: true,
        }
      )
      const subscription = await StripeHelper.retrieveSubscription(stripeSession.subscriptionId)
      await strapi.query('user', 'users-permissions').update(
        { id: user.id },
        {
          periodEnd: new Date(subscription.current_period_end * 1000),
          subscription: stripeSession.subscriptionId,
        }
      )
    }

    const companyData = {
      industry: params.industry,
      abn: params.abn,
    }

    await strapi.query('company').update(
      { id: params.companies[0] },
      {
        ...companyData,
      }
    )
    const sanitizedUser = sanitizeEntity(user, {
      model: strapi.query('user', 'users-permissions').model,
    })

    const jwt = strapi.plugins['users-permissions'].services.jwt.issue(_.pick(user, ['id']))

    if (user) {
      if (params.domains) {
        await Promise.all(
          params.domains.map((domain) =>
            axios.post(
              vulnerabilityHost,
              {
                domain,
                ownerOfScanner: user.id,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
          )
        )
      }

      const hostPhish = process.env.GOPHISH_HOST
      const apiKeyPhish = process.env.GOPHISH_API_KEY
      const dataRequest = {
        role: 'user',
        username: ctx.request.body.email,
        password: params.originalPassword || '123',
      }
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyPhish}`,
        },
      }

      if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        })
        Object.assign(options, {
          httpsAgent: agent,
        })
      }

      const responsePhish = await axios
        .post(`${hostPhish}/api/users/`, dataRequest, options)
        .catch((error) => {
          console.log(`\n Request Gophish error ${error} \n`)
          SlackHelper.sendSlackNotification({
            text: `[${process.env.PLATFORM_NAME}] Error: Create a gophish user ${user.email} failed on ${process.env.ENVIRONMENT}`,
          })
        })

      if (responsePhish && responsePhish.data) {
        await strapi.query('user', 'users-permissions').update(
          { id: user.id },
          {
            gophishApiKey: responsePhish.data.api_key,
            gophishUserId: responsePhish.data.id,
          }
        )
      }
    }

    return ctx.send({
      jwt,
      user: sanitizedUser,
    })
  } catch (error) {
    console.log({ error })
    return ctx.badRequest(error.message)
  }
}

module.exports = {
  emailRegExp,

  async callback(ctx) {
    const provider = ctx.params.provider || 'local'
    const params = ctx.request.body

    const store = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    })

    if (provider === 'local') {
      if (!_.get(await store.get({ key: 'grant' }), 'email.enabled')) {
        return ctx.badRequest(null, 'This provider is disabled.')
      }

      // The identifier is required.
      if (!params.identifier) {
        return ctx.badRequest('Please provide your e-mail')
      }

      // The password is required.
      if (!params.password) {
        return ctx.badRequest('Please provide your password')
      }

      if (!params.otp) {
        return ctx.badRequest('Please provide your otp')
      }

      const query = { provider }

      // Check if the provided identifier is an email or not.
      const isEmail = emailRegExp.test(params.identifier)

      // Set the identifier to the appropriate query field.
      if (isEmail) {
        query.email = params.identifier.toLowerCase()
      } else {
        query.username = params.identifier
      }

      // Check if the user exists.
      const user = await strapi.query('user', 'users-permissions').findOne(query)

      if (!user) {
        ctx.track?.error(400, 'User not found')
        return ctx.badRequest('Email or password invalid')
      }

      if (
        _.get(await store.get({ key: 'advanced' }), 'email_confirmation') &&
        user.confirmed !== true
      ) {
        return ctx.badRequest('Your account email is not confirmed')
      }

      if (user.blocked === true) {
        return ctx.locked('Your account has been blocked by an administrator')
      }

      // The user never authenticated with the `local` provider.
      if (!user.password) {
        return ctx.badRequest(
          'This user never set a local password, please login with the provider used during account creation'
        )
      }

      const validPassword = await strapi.plugins[
        'users-permissions'
      ].services.user.validatePassword(params.password, user.password)

      const validOtp = await strapi.plugins['cnc-core'].services['code-generated-log'].isValid({
        userId: user.id,
        type: 'otp',
        value: params.otp,
      })

      if (!validPassword || !validOtp) {
        await strapi.plugins['users-permissions'].services['usercustomflow'].countAttemptLogin(
          user.id
        )
        ctx.track?.error(400, 'Password or OTP invalid', user.id)
        return ctx.badRequest(
          !validPassword ? 'Email or password invalid' : 'Verification code is invalid or expired'
        )
      } else {
        strapi.plugins['users-permissions'].services['usercustomflow'].resetAttemptLogin(user.id)
        strapi.plugins['cnc-core'].services['code-generated-log'].clear({
          userId: user.id,
          type: 'otp',
        })
        ctx.track?.success(user.id)
        ctx.send({
          jwt: await strapi.plugins['users-permissions'].services.jwt.generateJwtToken({
            id: user.id,
          }),
          user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
            model: strapi.query('user', 'users-permissions').model,
          }),
        })
      }
    } else {
      if (!_.get(await store.get({ key: 'grant' }), [provider, 'enabled'])) {
        return ctx.badRequest('This provider is disabled')
      }

      // Connect the user with the third-party provider.
      let user
      let error
      try {
        ;[user, error] = await strapi.plugins['users-permissions'].services.providers.connect(
          provider,
          ctx.query
        )
      } catch ([user, error]) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error)
      }

      if (!user) {
        return ctx.badRequest(null, error === 'array' ? error[0] : error)
      }

      ctx.send({
        jwt: await strapi.plugins['users-permissions'].services.jwt.generateJwtToken({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      })
    }
  },

  async resetPassword(ctx) {
    const params = _.assign({}, ctx.request.body, ctx.params)

    if (
      params.password &&
      params.passwordConfirmation &&
      params.password === params.passwordConfirmation &&
      params.code
    ) {
      const query = {
        type: 'resetPassword',
        value: params.code,
      }

      const user = await strapi.plugins['cnc-core'].services['code-generated-log'].getUser(query)

      if (!user) {
        return ctx.badRequest('Your reset password link is invalid or has been used already')
      }

      if (user.blocked === true) {
        return ctx.locked('Your account has been blocked by an administrator')
      }

      const validCode = await strapi.plugins['cnc-core'].services['code-generated-log'].isValid(
        query
      )

      if (!validCode) {
        return ctx.badRequest('Your reset password link is invalid or has been used already')
      }

      const password = await strapi.plugins['users-permissions'].services.user.hashPassword({
        password: params.password,
      })

      // Update the user.
      await strapi.query('user', 'users-permissions').update({ id: user.id }, { password })
      await strapi.plugins['cnc-core'].services['code-generated-log'].clear({
        type: 'resetPassword',
        value: params.code,
      })

      ctx.send({
        jwt: strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        }),
        user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      })
    } else if (
      params.password &&
      params.passwordConfirmation &&
      params.password !== params.passwordConfirmation
    ) {
      return ctx.badRequest('Passwords do not match')
    } else {
      return ctx.badRequest('Incorrect params provided')
    }
  },

  async connect(ctx, next) {
    const grantConfig = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'grant',
      })
      .get()

    const [requestPath] = ctx.request.url.split('?')
    const provider = requestPath.split('/')[2]

    if (!_.get(grantConfig[provider], 'enabled')) {
      return ctx.badRequest(null, 'This provider is disabled.')
    }

    if (!strapi.config.server.url.startsWith('http')) {
      strapi.log.warn(
        'You are using a third party provider for login. Make sure to set an absolute url in config/server.js. More info here: https://strapi.io/documentation/developer-docs/latest/development/plugins/users-permissions.html#setting-up-the-server-url'
      )
    }

    // Ability to pass OAuth callback dynamically
    grantConfig[provider].callback = _.get(ctx, 'query.callback') || grantConfig[provider].callback
    grantConfig[provider].redirect_uri =
      strapi.plugins['users-permissions'].services.providers.buildRedirectUri(provider)

    return grant(grantConfig)(ctx, next)
  },

  async forgotPassword(ctx) {
    let { email } = ctx.request.body

    // Check if the provided email is valid or not.
    const isEmail = emailRegExp.test(email)

    if (isEmail) {
      email = email.toLowerCase()
    } else {
      return ctx.badRequest('Please provide valid email address')
    }

    const pluginStore = await strapi.store({
      environment: '',
      type: 'plugin',
      name: 'users-permissions',
    })

    const returnedMsg = `We have sent an email with instruction link to reset your password to ${email}. Be sure to check your spam folder. If you receive nothing, make sure the email you used is actually registered as a Scotpact Cybersecurity account.`

    // Find the user by email.
    const user = await strapi
      .query('user', 'users-permissions')
      .findOne({ email: email.toLowerCase() })

    // User not found.
    if (!user) {
      return ResponseHelper.successAction(ctx, returnedMsg)
    }

    if (user.blocked === true) {
      return ctx.locked('Your account has been blocked by an administrator')
    }

    // Generate random token.
    const resetPasswordToken = crypto.randomBytes(64).toString('hex')

    const settings = await pluginStore.get({ key: 'email' }).then((storeEmail) => {
      try {
        return storeEmail['reset_password'].options
      } catch (error) {
        return ResponseHelper.successAction(ctx, returnedMsg)
      }
    })

    const advanced = await pluginStore.get({
      key: 'advanced',
    })

    const userInfo = sanitizeEntity(user, {
      model: strapi.query('user', 'users-permissions').model,
    })

    settings.message = await strapi.plugins['users-permissions'].services.userspermissions.template(
      settings.message,
      {
        URL: advanced.email_reset_password,
        USER: userInfo,
        TOKEN: resetPasswordToken,
      }
    )

    settings.object = await strapi.plugins['users-permissions'].services.userspermissions.template(
      settings.object,
      {
        USER: userInfo,
      }
    )

    try {
      /** Email Reset Password */
      EmailHelper.sendResetPasswordEmail({
        url: advanced.email_reset_password,
        token: resetPasswordToken,
        email: email,
      })
    } catch (err) {
      return ResponseHelper.successAction(ctx, returnedMsg)
    }
    // Update the user.
    // await strapi.query('user', 'users-permissions').update({ id: user.id }, { resetPasswordToken })
    await strapi.plugins['cnc-core'].services['code-generated-log'].generate({
      userId: user.id,
      type: 'resetPassword',
      value: resetPasswordToken,
    })

    return ResponseHelper.successAction(ctx, returnedMsg)
  },

  async registerStaff(ctx) {
    let authorUser = await strapi
      .query('user', 'users-permissions')
      .findOne({ id: ctx.state.user.id })

    if (authorUser.role.type == 'admin') {
      if (!ctx.request.body.parentId) return ctx.badRequest('Please provide parentId')

      const clientRole = await strapi
        .query('role', 'users-permissions')
        .findOne({ type: 'client' }, [])

      authorUser = await QueryHelper.findOneOrError(ctx, {
        name: 'Parent',
        source: ['user', 'users-permissions'],
        query: {
          id: ctx.request.body.parentId,
          role: clientRole.id,
        },
      })
    }

    const { companies } = authorUser

    ctx.request.body.parents = [authorUser.id]
    ctx.request.body.companies = [companies[0].id]
    ctx.request.body.roleType = 'staff'
    ctx.request.body.version = authorUser.version

    return await register(ctx)
  },

  async registerClient(ctx) {
    ctx.request.body.roleType = 'client'
    ctx.request.body.version = 'full'

    // Company is required.
    if (!ctx.request.body.company) {
      return ctx.badRequest('Please provide your company')
    }

    // Set company
    const company = await QueryHelper.findOrCreate({
      source: ['company'],
      query: {
        name: ctx.request.body.company,
      },
    })

    ctx.request.body.companies = [company.id]

    return await register(ctx)
  },

  async selfRegisterClient(ctx) {
    ctx.request.body.roleType = 'client'
    ctx.request.body.version = ctx.request.body.version || 'free'
    ctx.request.body.isSelfRegistration = true
    ctx.request.body.isFirstLogin = false

    const { checkoutSessionId } = ctx.request.body

    const stripeSessionData = await strapi.query('payment-stripe-session').findOne({
      sessionId: checkoutSessionId,
    })

    if (stripeSessionData?.hasCreatedAccount) {
      return ctx.badRequest(
        'Your payment token is invalid or has been used already. Please check again!'
      )
    }

    // Company is required.
    if (!ctx.request.body.company) {
      return ctx.badRequest('Please provide your company')
    }

    // Set company
    const company = await strapi.query('company').create({ name: ctx.request.body.company })
    ctx.request.body.companies = [company.id]

    return await selfRegister(ctx)
  },

  async emailConfirmation(ctx, next, returnUser) {
    const { confirmation: confirmationToken } = ctx.query

    const { user: userService, jwt: jwtService } = strapi.plugins['users-permissions'].services

    if (_.isEmpty(confirmationToken)) {
      return ctx.badRequest('token.invalid')
    }

    const user = await userService.fetch({ confirmationToken }, [])

    if (!user) {
      return ctx.badRequest('token.invalid')
    }

    await userService.edit({ id: user.id }, { confirmed: true, confirmationToken: null })

    if (returnUser) {
      ctx.send({
        jwt: jwtService.issue({ id: user.id }),
        user: sanitizeEntity(user, {
          model: strapi.query('user', 'users-permissions').model,
        }),
      })
    } else {
      const settings = await strapi
        .store({
          environment: '',
          type: 'plugin',
          name: 'users-permissions',
          key: 'advanced',
        })
        .get()

      ctx.redirect(settings.email_confirmation_redirection || '/')
    }
  },

  async sendEmailConfirmation(ctx) {
    const params = _.assign(ctx.request.body)

    if (!params.email) {
      return ctx.badRequest('missing.email')
    }

    const isEmail = emailRegExp.test(params.email)

    if (isEmail) {
      params.email = params.email.toLowerCase()
    } else {
      return ctx.badRequest('wrong.email')
    }

    const user = await strapi.query('user', 'users-permissions').findOne({
      email: params.email,
    })

    if (user.confirmed) {
      return ctx.badRequest('already.confirmed')
    }

    if (user.blocked) {
      return ctx.badRequest('blocked.user')
    }

    try {
      await strapi.plugins['users-permissions'].services.user.sendConfirmationEmail(user)
      ctx.send({
        email: user.email,
        sent: true,
      })
    } catch (err) {
      return ctx.badRequest(null, err)
    }
  },

  async logout(ctx) {
    await strapi.plugins['cnc-core'].services['code-generated-log'].clear({
      userId: ctx.state.user.id,
      type: 'jwt',
    })
    return ResponseHelper.successAction(ctx)
  },
}
