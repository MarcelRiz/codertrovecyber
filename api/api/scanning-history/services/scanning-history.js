'use strict'
const sslChecker = require('ssl-checker')
const puppeteer = require('puppeteer')
const queryString = require('query-string')
const portscanner = require('portscanner')
const axios = require('axios')
const { buildQuery } = require('../../../helpers/QueryBuilderHelper')

const vulnerabilityHost = strapi.config.server.otherServices.vulnerabilityWorker
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async list(query) {
    const response = await axios.get(`${vulnerabilityHost}/api/scanningHistory${buildQuery(query)}`)

    let data = response?.data || []

    data.rows = await Promise.all(
      data.rows.map(async (item) => {
        const user = await strapi.plugins['users-permissions'].services.user.fetch({
          id: item.ownerOfScanner,
        })
        item.user = user || {}
        return item
      })
    )
    return data
  },

  async findOne(id) {
    const response = await axios.get(`${vulnerabilityHost}/api/scanningHistory/${id}`)
    return response.data
  },
}
