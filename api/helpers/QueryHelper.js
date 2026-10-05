const { capitalize } = require('lodash')

const wrapError = (ctx, { name, data }) => {
  if (data) return data
  ctx.throw(404, `${capitalize(name)} is invalid`)
}

module.exports = {
  async findOneOrError(ctx, { name, source, query }) {
    const data = await strapi.query(...source).findOne(query)
    return wrapError(ctx, {
      name,
      data,
    })
  },

  wrapError,

  async findOrCreate({ source, query, createQuery }) {
    const data = await strapi.query(...source).findOne(query)
    if (data) return data
    if (!createQuery) createQuery = query
    return await strapi.query(...source).create(createQuery)
  },

  getRoleByType(type) {
    return strapi.query('role', 'users-permissions').findOne({ type }, [])
  },
}
