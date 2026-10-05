'use strict'

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash')
const { sanitizeEntity, parseMultipartData } = require('strapi-utils')
const axios = require('axios')
const https = require('https')
const adminUserController = require('strapi-plugin-users-permissions/controllers/user/admin')
const apiUserController = require('./user/api')
const ResponseHelper = require('../../../helpers/ResponseHelper')
const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const GeneratorHelper = require('../../../helpers/GeneratorHelper')
const EmailHelper = require('../../../helpers/EmailHelper')
const QueryHelper = require('../../../helpers/QueryHelper')
const CryptoRsa = require('../../../util/cryptoRsa')

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  })

const resolveController = (ctx) => {
  const {
    state: { isAuthenticatedAdmin },
  } = ctx

  return isAuthenticatedAdmin ? adminUserController : apiUserController
}

const resolveControllerMethod = (method) => (ctx) => {
  ctx.request.body.username = ctx.request.body.email
  const controller = resolveController(ctx)
  const callbackFn = controller[method]

  if (!_.isFunction(callbackFn)) {
    return ctx.notFound()
  }

  return callbackFn(ctx)
}

module.exports = {
  create: resolveControllerMethod('create'),
  update: resolveControllerMethod('update'),

  /**
   * Retrieve user records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    let users
    const author = ctx.state?.user
    const role = author?.role?.type

    role == 'client' && (ctx.query['role.type'] = 'staff')

    if (_.has(ctx.query, '_q')) {
      // use core strapi query to search for users
      users = await strapi.query('user', 'users-permissions').search(ctx.query, populate)
    }

    if (role === 'admin' && ctx.query['role.type'] === 'client') {
      const queryOption = {
        ...ctx.query,
        'parents.role_eq': author.role.id,
      }
      const selfRegistrationQueryOption = {
        ...ctx.query,
        isSelfRegistration: true,
      }
      const [clientUsers, selfRegistrationUsers] = await Promise.all([
        strapi.plugins['users-permissions'].services.user.fetchAll(queryOption, populate),
        strapi.plugins['users-permissions'].services.user.fetchAll(
          selfRegistrationQueryOption,
          populate
        ),
      ])
      users = [...clientUsers, ...selfRegistrationUsers]
    } else {
      users = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query, populate)
    }

    if (ctx.query && (ctx.query['role.type'] === 'staff' || ctx.query['role.name'] === 'Staff')) {
      const getRoles = await this.getUserRoles()
      const mapperData = getRoles.reduce((acc, curr) => {
        Object.assign(acc, {
          [curr.type]: {
            ...curr,
          },
        })
        return acc
      }, {})

      const queryOption = {
        ...ctx.query,
        'role.type': 'client',
        previousRole_eq: `${mapperData['staff'].id}`,
      }
      delete queryOption['role.type']
      delete queryOption['role.name']

      const userPreviousRoleIsStaff = await strapi.plugins[
        'users-permissions'
      ].services.user.fetchAll(queryOption, populate)
      users = [...users, ...userPreviousRoleIsStaff]
    }

    // role == 'client' &&
    //   (users = users.filter((user) => user.parents.find((parent) => parent.id == author.id)))

    ctx.body = users.map(sanitizeUser)
  },

  /**
   * Retrieve a user record.
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params
    let data = await strapi.plugins['users-permissions'].services.user.fetch(
      {
        id,
      },
      [
        'userActionItems.actionItem',
        'userActionItems.customActionItem',
        'securityRating',
        'companies',
        'parents',
        'children',
        'role',
        'previousRole',
        'companies.logo',
        'companies.industry',
        'userQuestionGroups',
        'userQuestionGroups.questionGroup',
        'departmentId',
      ]
    )

    if (data) {
      data = sanitizeUser(data)
    }

    const queryUserQuestionGroups = await strapi.query('user-question-group', 'cnc-core').find(
      {
        'company.id': data?.companies[0]?.id,
      },
      ['questionGroup']
    )

    const queryUserActionItems = await strapi.query('user-action-item', 'cnc-core').find(
      {
        'company.id': data?.companies[0]?.id,
      },
      ['actionItem']
    )

    Object.assign(data, {
      companyUserQuestionGroups: queryUserQuestionGroups,
      companyUserActionItems: queryUserActionItems,
    })

    if (data.username && data.gophishApiKey) {
      const dataEncrypt = {
        username: data.username,
        apiKey: `${data.gophishApiKey}`,
      }

      const encrypted = CryptoRsa.encrypt(`${JSON.stringify(dataEncrypt)}`, 'gophish_id_rsa.pub')

      const gophishUrl = process.env.GOPHISH_DOMAIN
      Object.assign(data, {
        gophishLogin: `${gophishUrl}/fastLogin?token=${encrypted}`,
      })
    }

    // Send 200 `ok`
    ctx.body = data
  },

  /**
   * Retrieve user count.
   * @return {Number}
   */
  async count(ctx) {
    if (_.has(ctx.query, '_q')) {
      return await strapi.plugins['users-permissions'].services.user.countSearch(ctx.query)
    }
    ctx.body = await strapi.plugins['users-permissions'].services.user.count(ctx.query)
  },

  /**
   * Destroy a/an user record.
   * @return {Object}
   */
  async destroy(ctx) {
    const { id } = ctx.params

    const user = await QueryHelper.findOneOrError(ctx, {
      name: 'User Id',
      source: ['user', 'users-permissions'],
      query: {
        id,
      },
    })
    if (user && user?.gophishUserId) {
      const hostPhish = process.env.GOPHISH_HOST
      const apiKeyPhish = process.env.GOPHISH_API_KEY

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

      await axios
        .delete(`${hostPhish}/api/users/${user?.gophishUserId}`, options)
        .then((response) => {
          console.log(`\n Delete User in Gophish response: ${response?.data?.message} \n`)
        })
        .catch((error) => {
          console.log(`\n Delete User in Gophish error ${error} \n`)
        })
    }

    const data = await strapi.plugins['users-permissions'].services.user.remove({ id })
    ctx.send(sanitizeUser(data))
  },

  async destroyAll(ctx) {
    const {
      request: { query },
    } = ctx

    const toRemove = Object.values(_.omit(query, 'source'))
    const { primaryKey } = strapi.query('user', 'users-permissions')
    const finalQuery = { [`${primaryKey}_in`]: toRemove, _limit: 100 }

    const data = await strapi.plugins['users-permissions'].services.user.removeAll(finalQuery)

    ctx.send(data)
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }])
    }

    ctx.body = sanitizeUser(user)
  },

  async changePassword(ctx) {
    const params = ctx.request.body
    const userId = params.userId || ctx.state.user.id
    const user = await strapi.query('user', 'users-permissions').findOne({
      id: userId,
    })

    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      params.currentPassword,
      user.password
    )

    if (!validPassword) {
      return ResponseHelper.incorrectField(ctx, {
        field: 'Current password',
      })
    }

    params.password = await strapi.plugins['users-permissions'].services.user.hashPassword(params)
    await strapi.query('user', 'users-permissions').update(
      {
        id: userId,
      },
      {
        password: params.password,
        isFirstLogin: false,
      }
    )
    return ResponseHelper.successAction(ctx)
  },

  async importStaff(ctx) {
    try {
      let clientId = ctx.state?.user?.role?.type == 'client' ? ctx.state?.user?.id : null

      if (!clientId) {
        clientId = ctx.request?.body?.clientId
      }

      const { id: clientRole } = await QueryHelper.getRoleByType('client')
      console.log(clientId)
      const client =
        clientId &&
        (await QueryHelper.findOneOrError(ctx, {
          name: 'Client',
          source: ['user', 'users-permissions'],
          query: {
            id: clientId,
            role: clientRole,
          },
        }))

      const path = ctx.request?.files?.file?.path
      if (!path) {
        return ResponseHelper.invalidField(ctx, {
          field: 'File',
        })
      }
      const data = fs.readFileSync(path)
      let records
      try {
        records = parse(data, {
          columns: true,
          skip_empty_lines: true,
        })
      } catch (error) {
        return ctx.badRequest(`${error.code} - ${error.message}`)
      }

      const importIndex = strapi.plugins['users-permissions'].config.staffImportIndex

      const departmentKeys = records
        .reduce((acc, curr) => {
          if (curr['Department ID']) {
            acc.push(curr['Department ID'])
          } else {
            throw new Error('Missing Department ID')
          }
          return acc
        }, [])
        .filter((value, index, self) => self.indexOf(value) === index)

      const knex = strapi.connections.default
      const departments = await knex('departments')
        .whereIn('key', departmentKeys)
        .select('id', 'key')

      if (departmentKeys.length !== departments.length) {
        return ctx.badRequest('Department ID Is Not Valid')
      }

      const mapperDepartmentKey = departments.reduce((acc, curr) => {
        Object.assign(acc, {
          [curr.key]: curr.id,
        })
        return acc
      }, {})

      const updateRecords = records.reduce((acc, curr) => {
        const recordKey = curr['Department ID']
        if (mapperDepartmentKey[recordKey]) {
          acc.push({
            ...curr,
            'Department ID': mapperDepartmentKey[recordKey],
          })
        }
        return acc
      }, [])

      if (!_.isEmpty(updateRecords)) {
        const users = await Promise.all(
          updateRecords.map(async (record) => {
            try {
              const values = Object.values(record)
              let query = _.zipObject(importIndex, values)
              const { original, hash } = await GeneratorHelper.password()
              const { id: staffRole } = await QueryHelper.getRoleByType('staff')
              query = {
                ...query,
                username: query.email,
                password: hash,
                parents: [clientId],
                confirmed: true,
                blocked: false,
                assessmentCompleted: false,
                role: staffRole,
                companies: client.companies,
                provider: 'local',
              }

              const user = await strapi.query('user', 'users-permissions').create(query)
              EmailHelper.sendWelcomeEmail({
                ...user,
                password: original,
              })
              record.status = 'success'
              Date.now() < new Date('2021-08-23').getTime() && (record.password = original)
              return user
            } catch ({ code, message }) {
              record.status = 'failed'
              record.error = {
                code,
                message,
              }
            }
          })
        )
        return users
      }

      return records
    } catch (err) {
      console.log(`\n \n  ERROR ${err} \n`)
      ctx.badRequest(err.message)
    }
  },

  async deleteUsers(ctx) {
    const params = ctx.request.query
    const { ids } = params
    try {
      const knex = strapi.connections.default
      const result = await knex.transaction(async (trx) => {
        return await Promise.all(
          ids.map((id) => trx('users-permissions_user').where('id', id).del().returning('*'))
        )
      })
      return result
    } catch (error) {
      ctx.badRequest(error.toString())
    }
  },

  async changeBlockStatus(ctx) {
    const user = await QueryHelper.findOneOrError(ctx, {
      name: 'User',
      source: ['user', 'users-permissions'],
      query: {
        id: ctx.request.body.userId,
      },
    })
    await strapi.query('user', 'users-permissions').update(
      {
        id: ctx.request.body.userId,
      },
      {
        blocked: !user.blocked,
        attempLogin: 0,
      }
    )
    return ResponseHelper.successAction(ctx)
  },
  async summary(ctx) {
    const { user } = ctx.state
    try {
      return strapi.plugins['users-permissions'].services['user-summary'].summary(user.id)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },
  async summaryByUser(ctx) {
    try {
      const { id: userId } = ctx.params

      return strapi.plugins['users-permissions'].services['user-summary'].summaryByUser(userId)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },
  async createPhishingGroup(ctx) {
    try {
      const { id } = ctx.state.user
      let userData = await strapi.plugins['users-permissions'].services.user.fetch(
        {
          id,
        },
        [
          'userActionItems.actionItem',
          'userActionItems.customActionItem',
          'securityRating',
          'companies',
          'parents',
          'children',
          'role',
          'companies.logo',
          'companies.industry',
          'userQuestionGroups',
          'userQuestionGroups.questionGroup',
        ]
      )

      const hostPhish = process.env.GOPHISH_HOST
      const dataRequest = ctx.request.body
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.gophishApiKey}`,
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
        .post(`${hostPhish}/api/groups/`, dataRequest, options)
        .catch((error) => {
          console.log(`\n Request Gophish error ${error} \n`)
        })

      if (!responsePhish || !responsePhish.data) {
        return ctx.badRequest('Getting error when create group to Gophish')
      }

      return ResponseHelper.successAction(ctx)
    } catch (err) {
      console.log(`\n \n  ERROR ${err} \n`)
      ctx.badRequest(err.message)
    }
  },
  async getUserRoles() {
    const roles = await strapi.query('role', 'users-permissions').find({ _sort: 'name' }, [])

    for (let i = 0; i < roles.length; ++i) {
      roles[i].nb_users = await strapi
        .query('user', 'users-permissions')
        .count({ role: roles[i].id })
    }
    return roles
  },
  async updateUserRole(ctx) {
    try {
      const { id: userId } = ctx.params
      const { roleType } = ctx.request.body
      const getRoles = await this.getUserRoles()
      const mapperData = getRoles.reduce((acc, curr) => {
        Object.assign(acc, {
          [curr.type]: {
            ...curr,
          },
        })
        return acc
      }, {})

      if (mapperData['admin'].type === roleType) {
        return ctx.badRequest('Not permitted to assign this role')
      }

      const { role: currentRole } = await strapi.query('user', 'users-permissions').findOne(
        {
          id: userId,
        },
        ['role']
      )
      if (mapperData[roleType] && currentRole) {
        return strapi.query('user', 'users-permissions').update(
          { id: userId },
          {
            role: mapperData[roleType].id,
            previousRole: currentRole.id,
          }
        )
      }

      return ctx.badRequest('RoleType is not valid')
    } catch (err) {
      console.log(`\n \n updateUserRole ERROR ${err} \n`)
      ctx.badRequest(err.message)
    }
  },
}
