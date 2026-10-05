'use strict'
const { pick } = require('lodash')
const platform = require('platform')

module.exports = async (ctx, next) => {
  ctx.track = {
    status: null,
    author: null,
    error: (code, msg, author) => {
      ctx.track.status = `${code}: ${msg}`
      author && (ctx.track.author = author)
    },
    success: (author) => {
      ctx.track.status = 'Success'
      author && (ctx.track.author = author)
    },
  }

  let error

  try {
    await next()
  } catch (err) {
    error = err
  }

  if (error && !ctx.track.status) {
    ctx.track.status = error.message
  }

  if (ctx.track.status) {
    const platformData = platform.parse(ctx.header['user-agent'])
    strapi.query('activity-tracking', 'cnc-core').create({
      request: `${ctx.request.method} ${ctx.request.url}`,
      status: ctx.track?.status || '',
      os: `${platformData.os?.family} ${platformData.os?.architecture}bit ${
        platformData.os?.version || ''
      }`,
      ip: ctx.request?.ip,
      browser: platformData.description,
      payload: {
        authorizedUser: pick(ctx.state?.user, ['id', 'username', 'email', 'role.type']),
        requestData: pick(ctx.request, ['body', 'params', 'query']),
      },
      user: ctx.track?.author,
    })
  }

  if (error) throw error
}
