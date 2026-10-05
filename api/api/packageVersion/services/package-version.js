'use strict'
const axios = require('axios')
const { buildQuery } = require('../../../helpers/QueryBuilderHelper')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */
const vulnerabilityHost = strapi.config.server.otherServices.vulnerabilityWorker

module.exports = {
  async findAll(query) {
    const response = await axios.get(`${vulnerabilityHost}/api/packageVersion${buildQuery(query)}`)
    return response.data
  },

  async findOne(id) {
    const response = await axios.get(`${vulnerabilityHost}/api/packageVersion/${id}`)
    return response.data
  },

  async create(data) {
    const response = await axios.post(`${vulnerabilityHost}/api/packageVersion`, data)
    return response.data
  },

  async update(id, data) {
    const response = await axios.put(`${vulnerabilityHost}/api/packageVersion/${id}`, data)
    return response.data
  },

  async remove(id) {
    const response = await axios.delete(`${vulnerabilityHost}/api/packageVersion/${id}`)
    return response.data
  },
}
