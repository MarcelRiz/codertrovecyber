import api from './api'
import endpoint from '../constants/endpoint'

export default class CoursesService {
  static async getCourses() {
    return api.get(endpoint.courses.base, {
      params: {
        _limit: -1,
        _sort: 'id:asc',
      },
    })
  }

  static async getTotalCourses() {
    return api.get(`${endpoint.courses.count}`)
  }

  static async getAssignedCourses(userId) {
    return api.get(endpoint.courses.staffAssignedCourses, {
      params: {
        user: userId,
        course_null: false,
      },
    })
  }

  static async getTotalAssignedCourses(userId) {
    return api.get(endpoint.courses.staffAssignedCoursesCount, {
      params: {
        user: userId,
        course_null: false,
      },
    })
  }

  static async createAssignedCourses(userId, courseId, quizTypeformResponseID) {
    return api.post(endpoint.courses.staffAssignedCourses, {
      user: userId,
      course: courseId,
      quizTypeformResponseID,
    })
  }
}
