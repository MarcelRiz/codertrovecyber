import api from './api'
import { USER_ROLE } from '../constants'
import endpoint, { makeUrl } from '../constants/endpoint'

export default class StaffsService {
  static async createGroupStaff(data) {
    return api.post(endpoint.users.createPhishingGroup, data)
  }

  static async registerStaff(data) {
    return api.post(endpoint.auth.registerStaff, data)
  }

  static async getStaffsList(companyId) {
    return api.get(endpoint.users.base, {
      params: {
        _limit: -1,
        'role.name': USER_ROLE.STAFF,
        companies_in: [companyId],
      },
    })
  }

  static async updateStaff(id, data) {
    return api.put(`${endpoint.users.base}/${id}`, data)
  }

  static async deleteStaffs(ids) {
    return api.delete(endpoint.users.base, { params: { ids } })
  }

  static async updateUserRole(data) {
    const { roleType = 'staff', userId } = data
    const url = makeUrl(endpoint.users.updateUserRole, {
      userId,
    })
    return api.put(url, { roleType })
  }
}
