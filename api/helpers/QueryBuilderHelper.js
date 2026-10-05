module.exports = {
  buildQuery(query) {
    if (!query) return ''

    let result = ''
    for (let key in query) {
      if (query[key]) {
        if (Array.isArray(query[key])) {
          query[key].forEach((keyValue) => {
            result = result + `${key}=${keyValue}&`
          })
        } else {
          result = result + `${key}=${query[key]}&`
        }
      }
    }
    result = '?' + result.slice(0, -1)
    return result
  },
}
