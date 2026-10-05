import api from './api'
import endpoint, { makeUrl } from '../constants/endpoint'

export default class BlogService {
  static async getMarketplace() {
    const params = { _sort: 'created_at:desc' }
    return api.get(endpoint.marketplace.base, { params })
  }

  static async getMarketplaceDetail(id) {
    const url = makeUrl(endpoint.marketplace.getOne, {
      id,
    })
    return api.get(url)
  }
}
