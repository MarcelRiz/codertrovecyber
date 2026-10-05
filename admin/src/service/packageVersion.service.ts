/* eslint-disable no-useless-catch */
/* eslint-disable class-methods-use-this */
import axios from 'axios'

export default class PackageVersionService {
  async getVersions(packageID: string) {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/package-version?offset=0&limit=999999&packageID=${packageID}`
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async createVersion(dto: any) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/package-version`,
        dto
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async updateVersion(id: string, dto: any) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/package-version/${id}`,
        dto
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async removeVersion(id: string) {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/package-version/${id}`
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
