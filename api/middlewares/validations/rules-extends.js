const validator = require('validator')

// Extend rules here
validator.isNotEmpty = (val) => !validator.isEmpty(val)

validator.isSameWithField = (val, { comparisionField }, body) =>
  validator.equals(val, body[comparisionField])

module.exports = validator
