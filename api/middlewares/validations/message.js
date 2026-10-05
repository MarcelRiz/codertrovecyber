module.exports = {
  isLength: ({ field, params: { min, max } }) =>
    `Parameter '${field}' should have length of ${min} to ${max}`,
  isNotEmpty: ({ field }) => `Parameter '${field}' should not be empty`,
  isSameWithField: ({ field, params: { comparisionField } }) =>
    `Parameter '${field}' should be same with ${comparisionField}`,
  isIn: ({ field, params }) => `Parameter '${field}' should be one of [${params.join(',')}]`,
}
