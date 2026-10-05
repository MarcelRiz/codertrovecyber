'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const { resolve } = require('path')
const fs = require('fs')

module.exports = {
  lifecycles: {
    // fetch
    beforeFetch: async (entry) => {
      // console.log(`\n beforeFetch ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterFetch: async (entry) => {
      // console.log(`\n afterFetch ${JSON.stringify(entry, null, 2)} \n`)
    },

    // fetchAll
    beforeFetchAll: async (entry) => {
      // console.log(`\n beforeFetchAll ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterFetchAll: async (entry) => {
      // console.log(`\n afterFetchAll ${JSON.stringify(entry, null, 2)} \n`)
    },

    // create
    beforeCreate: async (entry) => {
      // console.log(`\n beforeCreate ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterCreate: async (entry) => {
      // console.log(`\n afterCreate ${JSON.stringify(entry, null, 2)} \n`)
      if (entry && entry?.image) {
        const { id } = entry.image
        const fetchFile = await strapi.plugins['upload'].services.upload.fetch({ id })

        const imagePathName = resolve(__dirname, `../../../public${fetchFile.url}`)
        const base64ImageFile = fs.readFileSync(imagePathName, { encoding: 'base64' })

        const imageUrl = await strapi.services['gcs'].uploadFileBase64({
          originalname: fetchFile.name,
          bufferString: base64ImageFile,
          mimetype: fetchFile.mime,
          author: fetchFile.created_by,
        })

        if (imageUrl) {
          const knex = strapi.connections.default
          await knex.transaction(async (trx) => {
            const record = await knex('market_places')
              .where('id', '=', entry.id)
              .update({
                thumbnailImage: imageUrl.fileUploadedInfo.id,
              })
              .transacting(trx)
              .returning('*')
            return record
          })

          // await strapi.plugins['upload'].services.upload.remove(fetchFile)
        }
      }
    },

    // update
    beforeUpdate: async (entry) => {
      // console.log(`\n beforeUpdate ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterUpdate: async (entry) => {
      if (entry && entry.image) {
        if (entry?.thumbnailImage && entry?.thumbnailImage?.id) {
          // await strapi.query('file-google-storage').delete({
          //   id: entry.thumbnailImage.id,
          // })
          await strapi.services['file-google-storage'].removeById({
            id: entry.thumbnailImage.id,
          })

          await strapi.services['gcs'].removeFile([entry.thumbnailImage.pathName])
        }

        const id = entry.image.id
        const fetchFile = await strapi.plugins['upload'].services.upload.fetch({ id })
        // if (!fetchFile) {
        //   return ctx.notFound('file.notFound')
        // }

        const imagePathName = resolve(__dirname, `../../../public${fetchFile.url}`)
        const base64ImageFile = fs.readFileSync(imagePathName, { encoding: 'base64' })

        const imageUrl = await strapi.services['gcs'].uploadFileBase64({
          originalname: fetchFile.name,
          bufferString: base64ImageFile,
          mimetype: fetchFile.mime,
          author: fetchFile.created_by,
        })
        // console.log(`\n imageUrl ${JSON.stringify(imageUrl, null, 2)} \n`)

        if (imageUrl) {
          const knex = strapi.connections.default
          await knex.transaction(async (trx) => {
            const record = await knex('market_places')
              .where('id', '=', entry.id)
              .update({
                thumbnailImage: imageUrl.fileUploadedInfo.id,
              })
              .transacting(trx)
              .returning('*')
            return record
          })

          // await strapi.plugins['upload'].services.upload.remove(fetchFile)
        }
      }
    },

    // deleteOne
    beforeDelete: async (entry) => {
      // console.log(`\n beforeDelete ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterDelete: async (entry) => {
      if (entry && entry.thumbnailImage) {
        const file = await strapi
          .query('file-google-storage')
          .findOne({ id: entry.thumbnailImage.id })

        // await strapi.query('file-google-storage').delete({
        //   id: file.id,
        // })
        await strapi.services['file-google-storage'].removeById({
          id: file.id,
        })

        await strapi.services['gcs'].removeFile([file.pathName])
      }
    },

    // deleteMany
    beforeDeleteMany: async (entry) => {
      // console.log(`\n beforeDeleteMany ${JSON.stringify(entry, null, 2)} \n`)
    },
    afterDeleteMany: async (entry) => {
      // console.log(`\n afterDeleteMany ${JSON.stringify(entry, null, 2)} \n`)
    },
  },
}
