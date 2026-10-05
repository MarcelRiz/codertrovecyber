import moment from 'moment'
import api from './api'

import UploadService from './UploadService'
import { POLICY_TYPE } from '../constants'
import endpoint, { makeUrl } from '../constants/endpoint'

export default class PoliciesService {
  static async createCompanyPolicy(data) {
    const { policyFile } = data
    const post = {
      ...data,
      isLive: true,
      publishedDate: moment().toJSON(),
      type: POLICY_TYPE.COMPANY,
    }
    delete post.policyFile

    const response = await api.post(endpoint.companyPolicy.base, post)

    // upload
    try {
      await UploadService.upload(
        policyFile,
        'company-policy',
        response.data.id,
        'policyFile'
      )
      return response
    } catch (error) {
      await this.deletePolicy(response.data.id)
      throw new Error(
        error?.response
          ? error.message
          : 'Uploaded file is invalid, please check again.'
      )
    }
  }

  static async updateCompanyPolicy(id, data) {
    const { policyFile } = data
    const post = {
      ...data,
    }
    delete post.policyFile

    const response = await api.put(`${endpoint.companyPolicy.base}/${id}`, post)

    if (policyFile) {
      // upload
      UploadService.upload(policyFile, 'company-policy', id, 'policyFile')
    }

    return response
  }

  static async getAllPolicies(companyId, isLiveOnly = false) {
    const params = {
      _limit: -1,
      company: companyId,
    }
    if (isLiveOnly) {
      params.isLive = true
    }
    return api.get(endpoint.companyPolicy.base, {
      params,
    })
  }

  static async getTotalPolicies(companyId, isLiveOnly = false) {
    const params = {
      company: companyId,
    }
    if (isLiveOnly) {
      params.isLive = true
    }
    return api.get(endpoint.companyPolicy.count, {
      params,
    })
  }

  static async deletePolicy(id) {
    return api.delete(`${endpoint.companyPolicy.base}/${id}`)
  }

  static async acknowledgePolicy(id) {
    return api.put(`${endpoint.companyPolicy.staffAssignedPolicies}/${id}`, {
      isAcknowledged: true,
    })
  }

  static async getAssignedPolicies(userId) {
    return api.get(endpoint.companyPolicy.staffAssignedPolicies, {
      params: {
        _limit: -1,
        user: userId,
        companyPolicy_null: false,
      },
    })
  }

  static async getTotalAssignedPolicies(userId) {
    return api.get(endpoint.companyPolicy.staffAssignedPoliciesCount, {
      params: {
        user: userId,
        companyPolicy_null: false,
      },
    })
  }

  static async countPolicyAcknowledged(policyId) {
    return api.get(endpoint.companyPolicy.staffAssignedPoliciesCount, {
      params: {
        companyPolicy: policyId,
        isAcknowledged: true,
      },
    })
  }

  static async getPolicyTemplates() {
    return api.get(endpoint.policyTemplate.base)
  }

  static async generatePolicies(companyId, policyTemplateIds, owner) {
    return api.post(`${endpoint.companyPolicy.generate}/${companyId}`, {
      policyTemplateIds,
      owner,
    })
  }

  static async assignPolicy(policyId, staffIds) {
    return api.put(`${endpoint.companyPolicy.base}/${policyId}`, {
      isLive: true,
      publishedDate: moment().toJSON(),
      staffIds,
    })
  }

  static async updateCyberPolicy(policyId, policyContent) {
    return api.put(`${endpoint.companyPolicy.base}/${policyId}`, {
      policyContent,
    })
  }

  static async getCompanyPolicyById(policyId) {
    return api.get(`${endpoint.companyPolicy.base}/${policyId}`)
  }

  static async getAssignedPolicyById(userId, policyId) {
    return api.get(endpoint.companyPolicy.staffAssignedPolicies, {
      params: {
        user: userId,
        companyPolicy: policyId,
      },
    })
  }

  static async bulkAssignPolicies(staffIds, policyIds) {
    return api.post(`${endpoint.companyPolicy.staffAssignedPolicies}/bulk`, {
      staffIds,
      policyIds,
    })
  }

  static async downloadPolicy(policyId) {
    const url = makeUrl(endpoint.companyPolicy.download, {
      id: policyId,
    })
    return new Promise((resolve, reject) => {
      api
        .get(url, {
          responseType: 'arraybuffer',
        })
        .then(response => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.onerror = error => {
            reject(error)
          }
          reader.readAsDataURL(new Blob([response.data]))
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  static async previewPolicy(companyId, policyTemplateId, owner) {
    return new Promise((resolve, reject) => {
      api
        .post(
          `${endpoint.companyPolicy.preview}`,
          {
            companyId,
            policyTemplateId,
            owner,
          },
          {
            responseType: 'arraybuffer',
          }
        )
        .then(response => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.onerror = error => {
            reject(error)
          }
          reader.readAsDataURL(new Blob([response.data]))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
