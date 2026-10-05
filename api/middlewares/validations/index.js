const validator = require('./rules-extends')
const message = require('./message')

const validate = (rule, params, ctx, field) => {
  const {
    request: { body },
  } = ctx
  const value = body ? (body[field] ? body[field] + '' : '') : ''
  if (!validator[rule](value, params, body, field)) {
    ctx.throw(400, `${message[rule]({ field, params })}`)
  }
  return
}

const extractRules = (ctx, field, rules) => {
  for (const rule of rules) {
    const [name, params] = rule
    validate(name, params, ctx, field)
  }
}

const extractValidations = (ctx, validations) => {
  for (const field in validations) {
    const rules = validations[field]
    extractRules(ctx, field, rules)
  }
}

const getPluginRoutes = (plugins) => {
  let pluginRoutes = []
  for (const name in plugins) {
    pluginRoutes = [...pluginRoutes, ...plugins[name].config.routes]
  }
  return pluginRoutes
}

const matchUrl = (path, url) => {
  const hasParam = /(\:{1}[^\/]+)/.test(path)
  if (!hasParam) return path == url
  const regExpPath = new RegExp(path.replace(/(\:{1}[^\/]+)/, '(.+)'))
  return regExpPath.test(url)
}

module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        const pluginRoutes = getPluginRoutes(strapi.plugins)
        const allRoutes = [...strapi.config.routes, ...pluginRoutes]
        const matchedRoute = allRoutes.find(
          (route) => matchUrl(route.path, ctx.request.url) && route.method == ctx.request.method
        )
        console.log(matchedRoute)
        matchedRoute && extractValidations(ctx, matchedRoute.validations)
        await next()
      })
    },
  }
}
