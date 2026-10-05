'use strict'

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async delete(id) {
    const category = await strapi.query('blog-category').find({
      id,
    })
    if (!category) {
      throw new Error('Category not found.')
    }

    const categoryBlogs = await strapi.query('blog').find({
      categoryId: id,
    })

    if (categoryBlogs.length) {
      throw new Error(
        'This category can not be deleted as one or more blogs are associated to this.'
      )
    }
    return strapi.query('blog-category').delete({ id })
  },
}
