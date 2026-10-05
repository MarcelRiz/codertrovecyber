export function downloadBlob(blob, filename) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.setAttribute('download', filename)
  a.click()
}

export default function download(url, filename) {
  fetch(url).then(t =>
    t.blob().then(b => {
      downloadBlob(b, filename)
    })
  )
}
