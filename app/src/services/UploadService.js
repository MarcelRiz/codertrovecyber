import api from './api'

export default class UploadService {
  static async upload(file, ref, refId, field) {
    const formData = new FormData()
    formData.append('files', file)
    formData.append('ref', ref)
    formData.append('refId', refId)
    formData.append('field', field)

    return api.post('/upload', formData)
  }

  static async delete(id) {
    return api.delete(`/upload/files/${id}`)
  }
}
