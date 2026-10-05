import api from './api'
import endpoint from '../constants/endpoint'

export default class ManageScanningService {
  static async getScanningList(payload) {
    const params = {
      ownerOfScanner: payload.ownerOfScanner,
    }
    return api.get(endpoint.manageScanning.base, { params })
  }
}
