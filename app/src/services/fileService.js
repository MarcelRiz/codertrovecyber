import api from './api'
import endpoint from '../constants/endpoint'

export default class FileService {
  static async getFile(data) {
    return api.post(`${endpoint.fileManagement.base}/getFile`, data)
  }
}
