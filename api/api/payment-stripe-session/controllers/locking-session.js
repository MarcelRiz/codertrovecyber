'use strict'
// let staticVariable = false
let staticVariable = {}

module.exports = {
  getLocking() {
    return staticVariable
  },

  setLocking(value) {
    staticVariable = value
    return staticVariable
  },

  getLockingByEmail(email) {
    const validValue = staticVariable?.[email]
    return validValue
  },

  setLockingByEmail(email) {
    const validValue = staticVariable?.[email]

    if (validValue) {
      Object.assign(staticVariable, {
        [email]: false,
      })
      return false
    }

    const newObj = {
      [email]: true,
    }

    Object.assign(staticVariable, newObj)
    return true
  },
}
