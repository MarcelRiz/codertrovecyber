import React, { useCallback, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Form } from 'react-bootstrap'
import Loading from '../loading'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function PdfViewer({ file, onLoadSuccess }) {
  const [numPages, setNumPages] = useState([])
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line no-shadow
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    const arr = []
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= numPages; i++) {
      arr.push(i)
    }
    setNumPages(arr)
    setLoading(false)
    onLoadSuccess()
  }, [])

  return (
    <div className={`pdf-viewer ${loading ? 'pdf-viewer--loading' : ''}`}>
      {loading && (
        <div className="text-center p-5">
          <Loading />
        </div>
      )}
      <div className="pdf-viewer__inner">
        <Document
          file={file}
          loading={loading}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {numPages.map(pageNumber => (
            <Page key={pageNumber} pageNumber={pageNumber} scale={scale} />
          ))}
        </Document>
      </div>

      <Form.Group className="pdf-viewer__scale">
        <Form.Control
          type="range"
          custom
          value={scale}
          onChange={e => {
            setScale(e.target.value)
          }}
          min={0.5}
          max={3.0}
          step={0.1}
        />
      </Form.Group>
    </div>
  )
}
