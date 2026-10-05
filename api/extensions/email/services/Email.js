'use strict'

const _ = require('lodash')

const getProviderSettings = () => {
  return strapi.plugins.email.config
}

const send = async (options) => {
  return strapi.plugins.email.provider.send(options)
}

const sendTemplate = async ({ templateId, data, ...restOptions } = {}) => {
  if (!templateId) return

  const options = {
    ...restOptions,
    template_id: templateId,
    dynamic_template_data: data,
  }
  return strapi.plugins.email.provider.send(options).catch((err) => console.log(err.response.body))
}

/**
 * fill subject, text and html using lodash template
 * @param {object} emailOptions - to, from and replyto...
 * @param {object} emailTemplate - object containing attributes to fill
 * @param {object} data - data used to fill the template
 * @returns {{ subject, text, subject }}
 */
const sendTemplatedEmail = (emailOptions = {}, emailTemplate = {}, data = {}) => {
  const attributes = ['subject', 'text', 'html']
  const missingAttributes = _.difference(attributes, Object.keys(emailTemplate))
  if (missingAttributes.length > 0) {
    throw new Error(
      `Following attributes are missing from your email template : ${missingAttributes.join(', ')}`
    )
  }

  const templatedAttributes = attributes.reduce(
    (compiled, attribute) =>
      emailTemplate[attribute]
        ? Object.assign(compiled, { [attribute]: _.template(emailTemplate[attribute])(data) })
        : compiled,
    {}
  )

  return strapi.plugins.email.provider.send({ ...emailOptions, ...templatedAttributes })
}

module.exports = {
  getProviderSettings,
  send,
  sendTemplatedEmail,
  sendTemplate,
}
