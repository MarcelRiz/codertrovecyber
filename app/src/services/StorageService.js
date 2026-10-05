const storageKey = {
  session: 'session',
  tempLogin: 'temp-login',
  signupInfo: 'signup-info',
  tempImage: 'temp-image',
}

export default class StorageService {
  static getSession() {
    const cached =
      localStorage.getItem(storageKey.session) ||
      sessionStorage.getItem(storageKey.session)
    return cached ? JSON.parse(cached) : null
  }

  static getIsRemember() {
    if (localStorage.getItem(storageKey.session)) return true
    if (sessionStorage.getItem(storageKey.session)) return false
    return false
  }

  static saveSession(data, remember) {
    if (remember) {
      localStorage.setItem(storageKey.session, JSON.stringify(data))
    } else {
      sessionStorage.setItem(storageKey.session, JSON.stringify(data))
    }
  }

  static clearSession() {
    localStorage.removeItem(storageKey.session)
    sessionStorage.removeItem(storageKey.session)
  }

  static saveTempLogin(email, password, remember) {
    sessionStorage.setItem(
      storageKey.tempLogin,
      btoa(
        JSON.stringify({
          email,
          password,
          remember,
        })
      )
    )
  }

  static getTempLogin() {
    return atob(sessionStorage.getItem(storageKey.tempLogin))
  }

  static removeTempLogin() {
    sessionStorage.removeItem(storageKey.tempLogin)
  }

  static getSignUpInfo() {
    const cached = localStorage.getItem(storageKey.signupInfo)
    return JSON.parse(cached)
  }

  static setSignUpInfo(payload) {
    localStorage.setItem(storageKey.signupInfo, JSON.stringify(payload))
  }

  static clearSignUpInfo() {
    localStorage.removeItem(storageKey.signupInfo)
  }

  static setTermImage(base64) {
    localStorage.setItem(storageKey.tempImage, base64)
  }

  static clearTermImage() {
    localStorage.removeItem(storageKey.tempImage)
  }
}
