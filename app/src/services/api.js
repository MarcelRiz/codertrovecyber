import axios from 'axios'
import endpoint from '../constants/endpoint'
import StorageService from './StorageService'

const api = axios.create({
  baseURL: endpoint.base,
})

api.interceptors.request.use(config => {
  const session = StorageService.getSession()
  if (session) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `bearer ${session.jwt}`
  }

  return config
})

api.interceptors.response.use(
  res => res,
  error => {
    const url = error?.response?.config?.url || ''
    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      if (error.response.status === 401 && url.includes('users/')) {
        StorageService.clearSession()
        // eslint-disable-next-line no-restricted-globals
        location.href = '/'
      }
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
