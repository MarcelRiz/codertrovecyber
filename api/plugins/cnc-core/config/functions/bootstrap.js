'use strict'

const _ = require('lodash')

const createExternalService = (serviceConfig) => {
  const providerName = _.toLower(serviceConfig.provider)
  let provider
  try {
    provider = require(`../../externals/${providerName}`)
  } catch (err) {
    if (err.code == 'MODULE_NOT_FOUND') {
      throw new Error(`The provider package isn't installed.`)
    }
    console.log(err)
  }
  return provider.init(serviceConfig.providerOptions, serviceConfig.settings)
}

module.exports = async () => {
  const externalProvider = _.get(strapi.plugins, 'cnc-core.config.externals', {})
  strapi.plugins['cnc-core'].externals = {}
  for (const item of externalProvider) {
    strapi.plugins['cnc-core'].externals[item.provider] = createExternalService(item)
  }
}
