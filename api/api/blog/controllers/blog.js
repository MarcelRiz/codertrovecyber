'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { thumbnailImage } = ctx.request.body
    const author = ctx.state?.user

    const storeFile = await strapi.query('file-google-storage').create({
      ...thumbnailImage,
      created_by: author.id,
    })
    const mirrorData = JSON.parse(JSON.stringify(ctx.request.body))
    mirrorData.thumbnailImage = storeFile.id

    return await strapi.query('blog').create(mirrorData)
  },

  async update(ctx) {
    const { thumbnailImage } = ctx.request.body
    const { id } = ctx.params
    const author = ctx.state?.user
    const mirrorData = JSON.parse(JSON.stringify(ctx.request.body))

    if (thumbnailImage && thumbnailImage.pathName) {
      const blog = await strapi.query('blog').findOne({ id })
      if (blog.thumbnailImage.pathName !== thumbnailImage.pathName) {
        const knex = strapi.connections.default

        try {
          await knex('file_google_storages').where('id', blog.thumbnailImage.id).del()
          await strapi.services['gcs'].removeFile([blog.thumbnailImage.pathName])
        } catch (error) {
          console.log(`\n Remove google file something wrong:\n${error} \n`)
        }
      }

      const storeFile = await strapi.query('file-google-storage').create({
        ...thumbnailImage,
        created_by: author.id,
      })
      mirrorData.thumbnailImage = storeFile.id

      if (!mirrorData.author && blog.author) {
        mirrorData.author = blog.author.id
      }
    }

    return await strapi.query('blog').update(
      { id: id },
      {
        ...mirrorData,
        categoryId: mirrorData.categoryId.id,
      }
    )
  },

  async delete(ctx) {
    const { id } = ctx.params
    const blog = await strapi.query('blog').findOne({ id })

    const removeBLog = await strapi.query('blog').delete({
      id: id,
    })
    if (blog.thumbnailImage) {
      // await strapi.query('file-google-storage').delete({
      //   id: blog.thumbnailImage.id,
      // })
      await strapi.services['file-google-storage'].removeById({
        id: blog.thumbnailImage.id,
      })

      await strapi.services['gcs'].removeFile([blog.thumbnailImage.pathName])
    }
    return removeBLog
  },
}
