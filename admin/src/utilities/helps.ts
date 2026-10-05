const  SortByFields = (data, key) => {
  data.sort((current, next) => {
    const valueCurrent = current[key].toUpperCase()
    const valuePrev = next[key].toUpperCase()
    if (valueCurrent < valuePrev) {
      return -1
    }
    if (valueCurrent > valuePrev) {
      return 1
    }
    return 0
  })
  return data
}

const DownloadFile = (url, name) => {
  if (!url) {
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        window.open(url, '_bank')
      }
    }
  }
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL
    const downUrl = urlCreator.createObjectURL(this.response)
    const tag = document.createElement('a')
    tag.href = downUrl
    tag.download = name || downUrl.substr(downUrl.lastIndexOf('/') + 1)
    document.body.appendChild(tag)
    tag.click()
    document.body.removeChild(tag)
  }
  xhr.send()
}

const IsFileImage = (file) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  return file && acceptedImageTypes.includes(file.type)
}

const IsFilePDF = (file) => {
  const acceptedImageTypes = ['application/pdf']

  return file && acceptedImageTypes.includes(file.type)
}

const IsFileCsv = (file) => {
  const acceptedImageTypes = ['.csv']
  return file  && (acceptedImageTypes.includes(file.type) || file.name.endsWith('.csv'))
}

export {SortByFields, DownloadFile, IsFileImage, IsFilePDF, IsFileCsv}