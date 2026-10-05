// import { get } from 'lodash'
import api from './api'
import endpoint from '../constants/endpoint'

export default class BlogService {
  static async getBlogCategory() {
    return api.get(`${endpoint.blogCategories.base}`)
  }

  static async getBlog(payload) {
    const params = { _sort: 'created_at:desc' }
    const { authorId, categoryId } = payload
    if (authorId) {
      params.author = authorId
    }
    if (categoryId) {
      params.categoryId = categoryId
    }

    return api.get(endpoint.blogs.base, { params })
  }

  static async getBlogDetail(id) {
    return api.get(`${endpoint.blogs.base}/${id}`)
  }
}
