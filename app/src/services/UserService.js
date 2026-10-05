import api from './api'
import UploadService from './UploadService'
import endpoint, { makeUrl } from '../constants/endpoint'
import StorageService from './StorageService'

export default class UserService {
  static async selfRegister(payload) {
    return api.post(endpoint.auth.selfRegister, payload)
  }

  static async requestOTP(identifier, password) {
    return api.post(endpoint.auth.requestOtp, {
      identifier,
      password,
    })
  }

  static async login(identifier, password, otp) {
    return api.post(endpoint.auth.login, {
      identifier,
      password,
      otp,
    })
  }

  static me() {
    const session = this.getSession()
    if (session) {
      const id = session.user?.id
      if (id) {
        return api.get(`${endpoint.users.base}/${id}`)
      }
    }

    throw new Error('User session out')
  }

  static async updateProfile(data) {
    const session = this.getSession()
    if (session) {
      const { id } = session.user
      return api.put(`${endpoint.users.base}/${id}`, data)
    }

    throw new Error('User session out')
  }

  static async getIndustries() {
    return api.get(`${endpoint.industries.base}?_sort=name:ASC`)
  }

  static async updateCompany(id, data) {
    const { logo, deletedLogo } = data
    // eslint-disable-next-line no-param-reassign
    delete data.logo
    if (deletedLogo) {
      await UploadService.delete(deletedLogo)
    }
    if (logo) {
      await UploadService.upload(logo, 'company', id, 'logo')
    }
    return api.put(`${endpoint.companies.base}/${id}`, data)
  }

  static async forgotPassword(identifier) {
    return api.post(endpoint.auth.forgotPassword, {
      email: identifier,
    })
  }

  static async resetPassword(code, password, passwordConfirmation) {
    return api.post(endpoint.auth.resetPassword, {
      code,
      password,
      passwordConfirmation,
    })
  }

  static async changePassword(currentPassword, password, passwordConfirmation) {
    return api.post(endpoint.users.changePassword, {
      currentPassword,
      password,
      passwordConfirmation,
    })
  }

  static async importStaffs(file) {
    const form = new FormData()
    form.append('file', file)

    return api.post(endpoint.users.importStaff, form)
  }

  static async companySummary(companyId) {
    const url = makeUrl(endpoint.companies.summary, {
      id: companyId,
    })
    return api.get(url)
  }

  static async userSummary() {
    const url = endpoint.users.summary
    return api.get(url)
  }

  static async userSummaryDetail(id) {
    const url = makeUrl(endpoint.users.summaryByUser, {
      userId: id,
    })
    return api.get(url)
  }

  // handle storage

  static getSession() {
    return StorageService.getSession()
  }

  static getIsRemember() {
    return StorageService.getIsRemember()
  }

  static saveSession(data, remember) {
    StorageService.saveSession(data, remember)
  }

  static clearSession() {
    StorageService.clearSession()
  }
}
