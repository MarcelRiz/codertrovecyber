import api from './api'
import endpoint from '../constants/endpoint'

export default class DepartmentService {
  static async getDepartments() {
    return api.get(`${endpoint.departments.base}`)
  }

  static async getDepartmentsSummary() {
    return api.get(`${endpoint.departments.base}/summary`)
  }
}
