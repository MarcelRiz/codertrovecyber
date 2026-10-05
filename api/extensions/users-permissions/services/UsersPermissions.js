'use strict'

const _ = require('lodash')
const request = require('request')

/**
 * UsersPermissions.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const DEFAULT_ALL_PERMISSIONS = [
  { action: 'connect', controller: 'auth', type: 'users-permissions', roleType: null },
  { action: 'init', controller: 'userspermissions', type: null, roleType: null },
  { action: 'me', controller: 'user', type: 'users-permissions', roleType: null },
  { action: 'autoreload', controller: null, type: null, roleType: null },
]

const DEFAULT_PUBLIC_ACTIONS = [
  'admincallback',
  'adminregister',
  'callback',
  'forgotpassword',
  'emailconfirmation',
  'resetpassword',
]

const DEFAULT_PUBLIC_PERMISSIONS = [
  ...DEFAULT_PUBLIC_ACTIONS.map((d) => ({
    action: d,
    controller: 'auth',
    type: 'users-permissions',
    roleType: 'public',
  })),
  { action: 'request', controller: 'otp', type: 'users-permissions', roleType: 'public' },
  {
    action: 'selfregisterclient',
    controller: 'auth',
    type: 'users-permissions',
    roleType: 'public',
  },
  // payment-stripe-session
  {
    action: 'stripetradingactioncreateclient',
    controller: 'payment-stripe-session',
    type: 'application',
    roleType: 'public',
  },
  {
    type: 'application',
    controller: 'payment-stripe-session',
    roleType: 'public',
    action: 'getstripesession',
  },
  // subscription
  {
    roleType: 'public',
    type: 'application',
    controller: 'subscription',
    action: 'subscriptioneventhandler',
  },
  // upload
  { action: 'upload', controller: 'upload', type: 'upload', roleType: 'public' },
  // industry
  { action: 'find', controller: 'industry', type: 'application', roleType: 'public' },
  //department
  { action: 'find', controller: 'department', type: 'application', roleType: 'public' },
]

const DEFAULT_STAFF_PERMISSIONS = [
  { action: 'findone', controller: 'user', type: 'users-permissions', roleType: 'staff' },
  { action: 'update', controller: 'user', type: 'users-permissions', roleType: 'staff' },
  { action: 'summary', controller: 'user', type: 'users-permissions', roleType: 'staff' },
  { action: 'changepassword', controller: 'user', type: 'users-permissions', roleType: 'staff' },
  { action: 'logout', controller: 'auth', type: 'users-permissions', roleType: 'staff' },
  // blog
  { action: 'findone', controller: 'blog', type: 'application', roleType: 'staff' },
  { action: 'find', controller: 'blog', type: 'application', roleType: 'staff' },
  // blog-category
  { action: 'findone', controller: 'blog-category', type: 'application', roleType: 'staff' },
  { action: 'find', controller: 'blog-category', type: 'application', roleType: 'staff' },
  // company-policy
  { action: 'find', controller: 'company-policy', type: 'application', roleType: 'staff' },
  { action: 'count', controller: 'company-policy', type: 'application', roleType: 'staff' },
  { action: 'download', controller: 'company-policy', type: 'application', roleType: 'staff' },
  { action: 'findone', controller: 'company-policy', type: 'application', roleType: 'staff' },
  // course
  { action: 'find', controller: 'course', type: 'application', roleType: 'staff' },
  { action: 'findone', controller: 'course', type: 'application', roleType: 'staff' },
  { action: 'count', controller: 'course', type: 'application', roleType: 'staff' },
  // staff-assigned-course
  { action: 'delete', controller: 'staff-assigned-course', type: 'application', roleType: 'staff' },
  { action: 'count', controller: 'staff-assigned-course', type: 'application', roleType: 'staff' },
  { action: 'find', controller: 'staff-assigned-course', type: 'application', roleType: 'staff' },
  {
    roleType: 'staff',
    type: 'application',
    action: 'findone',
    controller: 'staff-assigned-course',
  },
  { action: 'create', controller: 'staff-assigned-course', type: 'application', roleType: 'staff' },
  { action: 'update', controller: 'staff-assigned-course', type: 'application', roleType: 'staff' },
  // staff-assigned-policy
  { action: 'count', controller: 'staff-assigned-policy', type: 'application', roleType: 'staff' },
  { action: 'delete', controller: 'staff-assigned-policy', type: 'application', roleType: 'staff' },
  { action: 'find', controller: 'staff-assigned-policy', type: 'application', roleType: 'staff' },
  {
    roleType: 'staff',
    controller: 'staff-assigned-policy',
    action: 'findone',
    type: 'application',
  },
  { action: 'create', controller: 'staff-assigned-policy', type: 'application', roleType: 'staff' },
  { action: 'update', controller: 'staff-assigned-policy', type: 'application', roleType: 'staff' },
  // upload
  { action: 'upload', controller: 'upload', type: 'upload', roleType: 'staff' },
]

const DEFAULT_CLIENT_PERMISSIONS = [
  { action: 'update', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'registerstaff', controller: 'auth', type: 'users-permissions', roleType: 'client' },
  { action: 'findone', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'find', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'deleteusers', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'destroy', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'changepassword', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'updateuserrole', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'summarybyuser', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'logout', controller: 'auth', type: 'users-permissions', roleType: 'client' },
  {
    type: 'users-permissions',
    action: 'createphishinggroup',
    roleType: 'client',
    controller: 'user',
  },
  { action: 'create', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'count', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'getuserroles', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'summary', controller: 'user', type: 'users-permissions', roleType: 'client' },
  { action: 'importstaff', controller: 'user', type: 'users-permissions', roleType: 'client' },
  // vulnerability scan
  { action: 'scan', controller: 'vulnerability-scan', type: 'application', roleType: 'client' },
  {
    controller: 'vulnerability-scan',
    roleType: 'client',
    action: 'getlistsqlinjection',
    type: 'application',
  },
  {
    controller: 'vulnerability-scan',
    action: 'getonesqlinjection',
    type: 'application',
    roleType: 'client',
  },
  // assessment
  { action: 'submit', controller: 'assessment', type: 'application', roleType: 'client' },
  // action-item
  { action: 'done', controller: 'action-item', type: 'application', roleType: 'client' },
  // blog-category
  { action: 'findone', controller: 'blog-category', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'blog-category', type: 'application', roleType: 'client' },
  // blog
  { action: 'findone', controller: 'blog', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'blog', type: 'application', roleType: 'client' },
  // company
  { action: 'update', controller: 'company', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'company', type: 'application', roleType: 'client' },
  { action: 'summary', controller: 'company', type: 'application', roleType: 'client' },
  // company-policy
  { action: 'create', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'count', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'update', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'delete', controller: 'company-policy', type: 'application', roleType: 'client' },
  { action: 'preview', controller: 'company-policy', type: 'application', roleType: 'client' },
  {
    roleType: 'client',
    controller: 'company-policy',
    type: 'application',
    action: 'generatecyberpolicies',
  },
  { action: 'download', controller: 'company-policy', type: 'application', roleType: 'client' },
  // department
  { action: 'summary', controller: 'department', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'department', type: 'application', roleType: 'client' },
  { action: 'create', controller: 'file-google-storage', type: 'application', roleType: 'client' },
  // course
  { action: 'find', controller: 'course', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'course', type: 'application', roleType: 'client' },
  { action: 'count', controller: 'course', type: 'application', roleType: 'client' },
  // gcs
  { action: 'getfile', controller: 'gcs', type: 'application', roleType: 'client' },
  // market-place-service
  { action: 'count', controller: 'market-place-service', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'market-place-service', type: 'application', roleType: 'client' },
  {
    action: 'findone',
    controller: 'market-place-service',
    roleType: 'client',
    type: 'application',
  },
  // industry
  { action: 'count', controller: 'industry', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'industry', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'industry', type: 'application', roleType: 'client' },
  // policy-template
  { action: 'findone', controller: 'policy-template', type: 'application', roleType: 'client' },
  { action: 'count', controller: 'policy-template', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'policy-template', type: 'application', roleType: 'client' },
  // question group
  { action: 'find', controller: 'question-group', type: 'application', roleType: 'client' },
  { action: 'count', controller: 'question-group', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'question-group', type: 'application', roleType: 'client' },
  // response-type
  { action: 'findone', controller: 'response-type', type: 'application', roleType: 'client' },
  { action: 'count', controller: 'response-type', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'response-type', type: 'application', roleType: 'client' },
  // report
  { action: 'count', controller: 'report', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'report', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'report', type: 'application', roleType: 'client' },
  // report-type
  { action: 'count', controller: 'report-type', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'report-type', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'report-type', type: 'application', roleType: 'client' },
  // staff-assigned-course
  { action: 'count', controller: 'staff-assigned-course', type: 'application', roleType: 'client' },
  { action: 'find', controller: 'staff-assigned-course', type: 'application', roleType: 'client' },
  {
    roleType: 'client',
    controller: 'staff-assigned-course',
    type: 'application',
    action: 'delete',
  },
  {
    type: 'application',
    action: 'findone',
    controller: 'staff-assigned-course',
    roleType: 'client',
  },
  {
    action: 'update',
    type: 'application',
    roleType: 'client',
    controller: 'staff-assigned-course',
  },
  {
    roleType: 'client',
    action: 'create',
    controller: 'staff-assigned-course',
    type: 'application',
  },
  // staff-assigned-policy
  { action: 'count', controller: 'staff-assigned-policy', type: 'application', roleType: 'client' },
  {
    action: 'delete',
    controller: 'staff-assigned-policy',
    type: 'application',
    roleType: 'client',
  },
  {
    action: 'findone',
    type: 'application',
    roleType: 'client',
    controller: 'staff-assigned-policy',
  },
  { action: 'find', controller: 'staff-assigned-policy', type: 'application', roleType: 'client' },
  {
    action: 'update',
    controller: 'staff-assigned-policy',
    roleType: 'client',
    type: 'application',
  },
  {
    controller: 'staff-assigned-policy',
    action: 'create',
    type: 'application',
    roleType: 'client',
  },
  {
    action: 'bulkassignpolicies',
    type: 'application',
    roleType: 'client',
    controller: 'staff-assigned-policy',
  },
  { action: 'list', controller: 'scanning-history', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'scanning-history', type: 'application', roleType: 'client' },
  // market-place
  { action: 'find', controller: 'market-place', type: 'application', roleType: 'client' },
  {
    type: 'application',
    action: 'findone',
    controller: 'market-place',
    roleType: 'client',
  },
  // upload
  { action: 'upload', controller: 'upload', type: 'upload', roleType: 'client' },
  { action: 'destroy', controller: 'upload', type: 'upload', roleType: 'client' },

  // package
  { action: 'findall', controller: 'package', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'package', type: 'application', roleType: 'client' },
  // package version
  { action: 'findall', controller: 'packageVersion', type: 'application', roleType: 'client' },
  { action: 'findone', controller: 'packageVersion', type: 'application', roleType: 'client' },
]

const USER_ADMIN = [
  'count',
  'destroy',
  'find',
  'findone',
  'update',
  'changepassword',
  'updateuserrole',
  'changeblockstatus',
  'createphishinggroup',
  'count',
  'create',
  'destroyall',
  'getuserroles',
  'importstaff',
  'summary',
]

const ACTION_ITEM_ADMIN = ['count', 'delete', 'find', 'findone', 'update', 'create']
const APPLICATION_CONTROLLER = [
  'action-item',
  'blog',
  'blog-category',
  'checkin',
  'checkin-comment',
  'company',
  'course',
  'custom-action-item',
  'file-google-storage',
  'industry',
  'market-place-service',
  'policy-template',
  'question-group',
  'report',
  'report-type',
  'response-type',
  'staff-assigned-policy',
  'staff-assigned-course',
]

const DEFAULT_ADMIN_PERMISSIONS_ADDITION = APPLICATION_CONTROLLER.reduce(
  (previousPermissionsArray, currentValue) => {
    const permissions = ACTION_ITEM_ADMIN.map((d) => ({
      action: d,
      controller: currentValue,
      type: 'application',
      roleType: 'admin',
    }))

    return [...previousPermissionsArray, ...permissions]
  },
  []
)

const DEFAULT_ADMIN_PERMISSIONS = [
  { action: 'registerclient', controller: 'auth', type: 'users-permissions', roleType: 'admin' },
  { action: 'registerstaff', controller: 'auth', type: 'users-permissions', roleType: 'client' },

  ...USER_ADMIN.map((d) => ({
    action: d,
    controller: 'user',
    type: 'users-permissions',
    roleType: 'admin',
  })),

  { action: 'logout', controller: 'auth', type: 'users-permissions', roleType: 'admin' },
  { action: 'scan', controller: 'vulnerability-scan', type: 'application', roleType: 'admin' },
  { action: 'summary', controller: 'company', type: 'application', roleType: 'admin' },
  { action: 'dashboardsummary', controller: 'admin-zone', type: 'application', roleType: 'admin' },
  { action: 'find', controller: 'department', type: 'application', roleType: 'admin' },
  {
    action: 'getuserresponse',
    controller: 'question-group',
    type: 'application',
    roleType: 'admin',
  },

  ...DEFAULT_ADMIN_PERMISSIONS_ADDITION,
  // gcs
  { action: 'getfile', controller: 'gcs', type: 'application', roleType: 'admin' },
  { action: 'getsignaturecreatefile', controller: 'gcs', type: 'application', roleType: 'admin' },
  { action: 'removefile', controller: 'gcs', type: 'application', roleType: 'admin' },
  { action: 'uploadfilelite', controller: 'gcs', type: 'application', roleType: 'admin' },
  // manage-scanning
  { action: 'list', controller: 'manage-scanning', type: 'application', roleType: 'admin' },
  { action: 'create', controller: 'manage-scanning', type: 'application', roleType: 'admin' },
  { action: 'remove', controller: 'manage-scanning', type: 'application', roleType: 'admin' },
  { action: 'update', controller: 'manage-scanning', type: 'application', roleType: 'admin' },
  // upload
  { action: 'upload', controller: 'upload', type: 'upload', roleType: 'admin' },
  // package
  { action: 'createpackage', controller: 'package', type: 'application', roleType: 'admin' },
  { action: 'updatepackage', controller: 'package', type: 'application', roleType: 'admin' },
  { action: 'removepackage', controller: 'package', type: 'application', roleType: 'admin' },
  { action: 'findallpackage', controller: 'package', type: 'application', roleType: 'admin' },
  { action: 'findonepackage', controller: 'package', type: 'application', roleType: 'admin' },
  // package version
  { action: 'findall', controller: 'package-version', type: 'application', roleType: 'admin' },
  { action: 'findone', controller: 'package-version', type: 'application', roleType: 'admin' },
  { action: 'create', controller: 'package-version', type: 'application', roleType: 'admin' },
  { action: 'update', controller: 'package-version', type: 'application', roleType: 'admin' },
  { action: 'remove', controller: 'package-version', type: 'application', roleType: 'admin' },
]

const DEFAULT_PERMISSIONS = [
  ...DEFAULT_ALL_PERMISSIONS,
  ...DEFAULT_PUBLIC_PERMISSIONS,
  ...DEFAULT_STAFF_PERMISSIONS,
  ...DEFAULT_CLIENT_PERMISSIONS,
  ...DEFAULT_ADMIN_PERMISSIONS,
]

const isPermissionEnabled = (permission, role) =>
  DEFAULT_PERMISSIONS.some(
    (defaultPerm) =>
      (defaultPerm.action === null || permission.action === defaultPerm.action) &&
      (defaultPerm.controller === null || permission.controller === defaultPerm.controller) &&
      (defaultPerm.type === null || permission.type === defaultPerm.type) &&
      (defaultPerm.roleType === null || role.type === defaultPerm.roleType)
  )

module.exports = {
  async createRole(params) {
    if (!params.type) {
      params.type = _.snakeCase(_.deburr(_.toLower(params.name)))
    }

    const role = await strapi
      .query('role', 'users-permissions')
      .create(_.omit(params, ['users', 'permissions']))

    const arrayOfPromises = Object.keys(params.permissions || {}).reduce((acc, type) => {
      Object.keys(params.permissions[type].controllers).forEach((controller) => {
        Object.keys(params.permissions[type].controllers[controller]).forEach((action) => {
          acc.push(
            strapi.query('permission', 'users-permissions').create({
              role: role.id,
              type,
              controller,
              action: action.toLowerCase(),
              ...params.permissions[type].controllers[controller][action],
            })
          )
        })
      })

      return acc
    }, [])

    // Use Content Manager business logic to handle relation.
    if (params.users && params.users.length > 0)
      arrayOfPromises.push(
        strapi.query('role', 'users-permissions').update(
          {
            id: role.id,
          },
          { users: params.users }
        )
      )

    return await Promise.all(arrayOfPromises)
  },

  async deleteRole(roleID, publicRoleID) {
    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ id: roleID }, ['users', 'permissions'])

    if (!role) {
      throw new Error('Cannot find this role')
    }

    // Move users to guest role.
    const arrayOfPromises = role.users.reduce((acc, user) => {
      acc.push(
        strapi.query('user', 'users-permissions').update(
          {
            id: user.id,
          },
          {
            role: publicRoleID,
          }
        )
      )

      return acc
    }, [])

    // Remove permissions related to this role.
    role.permissions.forEach((permission) => {
      arrayOfPromises.push(
        strapi.query('permission', 'users-permissions').delete({
          id: permission.id,
        })
      )
    })

    // Delete the role.
    arrayOfPromises.push(strapi.query('role', 'users-permissions').delete({ id: roleID }))

    return await Promise.all(arrayOfPromises)
  },

  getPlugins(lang = 'en') {
    return new Promise((resolve) => {
      request(
        {
          uri: `https://marketplace.strapi.io/plugins?lang=${lang}`,
          json: true,
          timeout: 3000,
          headers: {
            'cache-control': 'max-age=3600',
          },
        },
        (err, response, body) => {
          if (err || response.statusCode !== 200) {
            return resolve([])
          }

          resolve(body)
        }
      )
    })
  },

  getActions() {
    const generateActions = (data) =>
      Object.keys(data).reduce((acc, key) => {
        if (_.isFunction(data[key])) {
          acc[key] = { enabled: false, policy: '' }
        }

        return acc
      }, {})

    const appControllers = Object.keys(strapi.api || {})
      .filter((key) => !!strapi.api[key].controllers)
      .reduce(
        (acc, key) => {
          Object.keys(strapi.api[key].controllers).forEach((controller) => {
            acc.controllers[controller] = generateActions(strapi.api[key].controllers[controller])
          })

          return acc
        },
        { controllers: {} }
      )

    const pluginsPermissions = Object.keys(strapi.plugins).reduce((acc, key) => {
      const initialState = {
        controllers: {},
      }

      acc[key] = Object.keys(strapi.plugins[key].controllers).reduce((obj, k) => {
        obj.controllers[k] = generateActions(strapi.plugins[key].controllers[k])

        return obj
      }, initialState)

      return acc
    }, {})

    const permissions = {
      application: {
        controllers: appControllers.controllers,
      },
    }

    return _.merge(permissions, pluginsPermissions)
  },

  async getRole(roleID, plugins) {
    const role = await strapi
      .query('role', 'users-permissions')
      .findOne({ id: roleID }, ['permissions'])

    if (!role) {
      throw new Error('Cannot find this role')
    }

    // Group by `type`.
    const permissions = role.permissions.reduce((acc, permission) => {
      _.set(acc, `${permission.type}.controllers.${permission.controller}.${permission.action}`, {
        enabled: _.toNumber(permission.enabled) == true,
        policy: permission.policy,
      })

      if (permission.type !== 'application' && !acc[permission.type].information) {
        acc[permission.type].information =
          plugins.find((plugin) => plugin.id === permission.type) || {}
      }

      return acc
    }, {})

    return {
      ...role,
      permissions,
    }
  },

  async getRoles() {
    const roles = await strapi.query('role', 'users-permissions').find({ _sort: 'name' }, [])

    for (let i = 0; i < roles.length; ++i) {
      roles[i].nb_users = await strapi
        .query('user', 'users-permissions')
        .count({ role: roles[i].id })
    }

    return roles
  },

  async getRoutes() {
    const routes = Object.keys(strapi.api || {}).reduce((acc, current) => {
      return acc.concat(_.get(strapi.api[current].config, 'routes', []))
    }, [])
    const clonedPlugins = _.cloneDeep(strapi.plugins)
    const pluginsRoutes = Object.keys(clonedPlugins || {}).reduce((acc, current) => {
      const routes = _.get(clonedPlugins, [current, 'config', 'routes'], []).reduce((acc, curr) => {
        const prefix = curr.config.prefix
        const path = prefix !== undefined ? `${prefix}${curr.path}` : `/${current}${curr.path}`
        _.set(curr, 'path', path)

        return acc.concat(curr)
      }, [])

      acc[current] = routes

      return acc
    }, {})

    return _.merge({ application: routes }, pluginsRoutes)
  },

  async updatePermissions() {
    const knex = strapi.connections.default
    const { primaryKey } = strapi.query('permission', 'users-permissions')
    const roles = await strapi.query('role', 'users-permissions').find({}, [])
    const rolesMap = roles.reduce((map, role) => ({ ...map, [role[primaryKey]]: role }), {})
    await knex('users-permissions_permission').where({}).del()
    await knex.raw('TRUNCATE TABLE "users-permissions_permission" RESTART IDENTITY;')
    const dbPermissions = await strapi.query('permission', 'users-permissions').find({ _limit: -1 })
    let permissionsFoundInDB = dbPermissions.map(
      (p) => `${p.type}.${p.controller}.${p.action}.${p.role[primaryKey]}`
    )
    permissionsFoundInDB = _.uniq(permissionsFoundInDB)

    // Aggregate first level actions.
    const appActions = Object.keys(strapi.api || {}).reduce((acc, api) => {
      Object.keys(_.get(strapi.api[api], 'controllers', {})).forEach((controller) => {
        const actions = Object.keys(strapi.api[api].controllers[controller])
          .filter((action) => _.isFunction(strapi.api[api].controllers[controller][action]))
          .map((action) => `application.${controller}.${action.toLowerCase()}`)

        acc = acc.concat(actions)
      })

      return acc
    }, [])

    // Aggregate plugins' actions.
    const pluginsActions = Object.keys(strapi.plugins).reduce((acc, plugin) => {
      Object.keys(strapi.plugins[plugin].controllers).forEach((controller) => {
        const actions = Object.keys(strapi.plugins[plugin].controllers[controller])
          .filter((action) => _.isFunction(strapi.plugins[plugin].controllers[controller][action]))
          .map((action) => `${plugin}.${controller}.${action.toLowerCase()}`)

        acc = acc.concat(actions)
      })

      return acc
    }, [])

    const actionsFoundInFiles = appActions.concat(pluginsActions)

    // create permissions for each role
    let permissionsFoundInFiles = actionsFoundInFiles.reduce(
      (acc, action) => [...acc, ...roles.map((role) => `${action}.${role[primaryKey]}`)],
      []
    )
    permissionsFoundInFiles = _.uniq(permissionsFoundInFiles)

    // Compare to know if actions have been added or removed from controllers.
    if (!_.isEqual(permissionsFoundInDB.sort(), permissionsFoundInFiles.sort())) {
      const splitted = (str) => {
        const [type, controller, action, roleId] = str.split('.')

        return { type, controller, action, roleId }
      }

      // We have to know the difference to add or remove the permissions entries in the database.
      const toRemove = _.difference(permissionsFoundInDB, permissionsFoundInFiles).map(splitted)
      const toAdd = _.difference(permissionsFoundInFiles, permissionsFoundInDB).map(splitted)

      const query = strapi.query('permission', 'users-permissions')

      // Execute request to update entries in database for each role.
      await Promise.all(
        toAdd.map((permission) =>
          query.create({
            type: permission.type,
            controller: permission.controller,
            action: permission.action,
            enabled: isPermissionEnabled(permission, rolesMap[permission.roleId]),
            policy: '',
            role: permission.roleId,
          })
        )
      )

      await Promise.all(
        toRemove.map((permission) => {
          const { type, controller, action, roleId: role } = permission
          return query.delete({ type, controller, action, role })
        })
      )
    }
  },

  async initialize() {
    const roleCount = await strapi.query('role', 'users-permissions').count()

    if (roleCount === 0) {
      await strapi.query('role', 'users-permissions').create({
        name: 'Public',
        description: 'Default role given to unauthenticated user.',
        type: 'public',
      })

      await strapi.query('role', 'users-permissions').create({
        name: 'Staff',
        description: 'Default role given to staff user.',
        type: 'staff',
      })

      await strapi.query('role', 'users-permissions').create({
        name: 'Client',
        description: 'Default role given to client user.',
        type: 'client',
      })

      await strapi.query('role', 'users-permissions').create({
        name: 'Admin',
        description: 'Default role given to admin user.',
        type: 'admin',
      })
    }

    return this.updatePermissions()
  },

  async updateRole(roleID, body) {
    const [role, authenticated] = await Promise.all([
      this.getRole(roleID, []),
      strapi.query('role', 'users-permissions').findOne({ type: 'authenticated' }, []),
    ])

    await strapi
      .query('role', 'users-permissions')
      .update({ id: roleID }, _.pick(body, ['name', 'description']))

    await Promise.all(
      Object.keys(body.permissions || {}).reduce((acc, type) => {
        Object.keys(body.permissions[type].controllers).forEach((controller) => {
          Object.keys(body.permissions[type].controllers[controller]).forEach((action) => {
            const bodyAction = body.permissions[type].controllers[controller][action]
            const currentAction = _.get(
              role.permissions,
              `${type}.controllers.${controller}.${action}`,
              {}
            )

            if (!_.isEqual(bodyAction, currentAction)) {
              acc.push(
                strapi.query('permission', 'users-permissions').update(
                  {
                    role: roleID,
                    type,
                    controller,
                    action: action.toLowerCase(),
                  },
                  bodyAction
                )
              )
            }
          })
        })

        return acc
      }, [])
    )

    // Add user to this role.
    const newUsers = _.differenceBy(body.users, role.users, 'id')
    await Promise.all(newUsers.map((user) => this.updateUserRole(user, roleID)))

    const oldUsers = _.differenceBy(role.users, body.users, 'id')
    await Promise.all(oldUsers.map((user) => this.updateUserRole(user, authenticated.id)))
  },

  async updateUserRole(user, role) {
    return strapi.query('user', 'users-permissions').update({ id: user.id }, { role })
  },

  template(layout, data) {
    const compiledObject = _.template(layout)
    return compiledObject(data)
  },
}
