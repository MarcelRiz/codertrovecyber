module.exports = {
  async getFile(ctx) {
    try {
      const { pathName } = ctx.request.body
      return strapi.services['gcs'].getFile(pathName)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  async getSignatureCreateFile(ctx) {
    try {
      const { fileName } = ctx.request.body
      return strapi.services['gcs'].getSignatureCreateFile(fileName)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  async removeFile(ctx) {
    try {
      const { pathName } = ctx.request.body
      return strapi.services['gcs'].removeFile(pathName)
    } catch (e) {
      ctx.badRequest(e.toString())
    }
  },

  async uploadFileLite(ctx) {
    try {
      // console.log(`\n ctx.request ${JSON.stringify(ctx.request)} \n`)
      // console.log(`\n ctx.request.files ${JSON.stringify(ctx.request.files)} \n`)
      // console.log(`\n ctx.request.file ${ctx.request.file} \n`)
      const author = ctx.state?.user
      const imageUrl = await strapi.services['gcs'].uploadFileLite(ctx.request.files.upload, author)

      return {
        uploaded: true,
        url: imageUrl.publicUrl,
        data: imageUrl,
      }
    } catch (err) {
      ctx.body = err
    }
  },
}
