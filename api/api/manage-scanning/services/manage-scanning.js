'use strict'
const axios = require('axios')
const { buildQuery } = require('../../../helpers/QueryBuilderHelper')

const vulnerabilityHost = `${strapi.config.server.otherServices.vulnerabilityWorker}/api/manageScanning`
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getAll(query) {
    const response = await axios.get(`${vulnerabilityHost}${buildQuery(query)}`)

    let data = response?.data || []

    // data.rows = await Promise.all(
    //   data.rows.map(async (item) => {
    //     const user = await strapi.plugins['users-permissions'].services.user.fetch({
    //       id: item.ownerOfScanner,
    //     })
    //     item.user = user || {}
    //     return item
    //   })
    // )
    return data
  },

  async create(data) {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await axios.post(
      vulnerabilityHost,
      {
        ...data,
      },
      options
    )
    return response.data
  },

  async remove(id) {
    const response = await axios.delete(`${vulnerabilityHost}/${id}`)
    return response.data
  },

  async update(id, data) {
    const response = await axios.put(`${vulnerabilityHost}/${id}`, data)
    return response.data
  },
}
