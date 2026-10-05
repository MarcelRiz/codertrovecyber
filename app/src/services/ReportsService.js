import api from './api'
import endpoint from '../constants/endpoint'

export default class ReportsService {
  static async getReportTypes() {
    return api.get(endpoint.reports.reportTypes)
  }

  static async getReports(userId) {
    return api.get(endpoint.reports.base, {
      params: {
        user: userId,
        _limit: -1,
      },
    })
  }
}
