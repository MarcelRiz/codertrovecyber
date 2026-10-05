import api from './api'
import endpoint, { makeUrl } from '../constants/endpoint'

export default class ActionItemsService {
  static async submitAssessment(responseId, groupId = null) {
    return api.post(endpoint.assessment.submit, {
      responseId,
      groupId,
    })
  }

  static async markCompleted(userActionItemId) {
    const url = makeUrl(endpoint.actionItems.done, {
      id: userActionItemId,
    })
    return api.get(url)
  }

  static async getQuestionGroup() {
    return api.get(endpoint.assessment.questionGroups)
  }
}
