'use strict'
const ResponseHelper = require('../../../helpers/ResponseHelper')

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async removeById({ id }) {
    try {
      // await knex('file_google_storages').where('id', id).del()
      const knex = strapi.connections.default
      const removeItem = await knex.transaction(async (trx) => {
        const record = await knex('file_google_storages')
          .where('id', id)
          .del()
          .transacting(trx)
          .returning('*')
        return record
      })
      console.log(`\n [file-google-storage] removeItem ${id} ${JSON.stringify(removeItem)}\n`)

      // return ResponseHelper.successAction(removeItem)
      return removeItem
    } catch (error) {
      console.log(`\n file-google-storage removeItem error ${error} \n`)
      return error
    }
  },
}
