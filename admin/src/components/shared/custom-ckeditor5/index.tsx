import React, { useCallback, useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Form } from 'react-bootstrap'
import styled from 'styled-components'

const EditorCustom = dynamic(() => import('./ckeditor5'), {
  ssr: false,
})

const WrapEditorComponent = ({ data = '', onDone, isError }) => {
  const componentRef = useRef('')
  const wrapComponentRef = useRef(null)
  const [editorError, setEditorError] = useState(false)
  const [filledContent, setFilledContent] = useState('')
  const isChange = useRef(false)

  // useMemo(() => {
  //   // componentWillMount events
  //   setFilledContent('')
  // },[])

  // useEffect(() => {
  //   // componentWillUnMount events
  //   setFilledContent('')
  // }, [])

  useEffect(() => {
    if (data && !isChange.current) {
      hdRequireVal(data)
    }
  })

  const formatHtml = useCallback(newContent => {
    let mimicContent = newContent
    const styleTable = `<style>
      .ck-widget__selection-handle {
        display: none;
      }
      .ck-reset_all {
        display: none;
      }
      .media {
        display: block;
        margin-left: auto;
        margin-right: auto;
        // width: 50%;
        text-align: center;
      }
      iframe {
        width: 90%;
        height: 36vh;
      }
      .image {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      img {
        max-width: 100%;
      }
      .table {
        width: 90% !important;
      }
      td {
        padding: 1px;
      }
      th {
        background-color: #ccc;
      }
      table, td, tr, th, .flagtable {
        border: 1px solid black;
        border-collapse: collapse;
      }
      table {
        width: 100%;
      }
      body {
        margin: 0
      }
    </style>`

    if (mimicContent.indexOf('.flagtable') === -1) {
      mimicContent += styleTable
    }
    return mimicContent
  }, [])

  const clearStyle = useCallback(
    val => val.replace(/(<style[\w\W]+style>)/g, ''),
    []
  )

  const hdRequireVal = useCallback(val => {
    const isNotEmpty = clearStyle(val)
    if (isNotEmpty) {
      onDone(val)
      return val
    }
    onDone(isNotEmpty)
    return isNotEmpty
  }, [])

  const handleChange = useCallback(newContent => {
    // console.log('newContent', newContent)
    const getFormat = formatHtml(newContent)
    componentRef.current = getFormat
    hdRequireVal(getFormat)
    isChange.current = true
  }, [])

  const asPreview = useCallback(value => {
    const myWindow = window.open()
    myWindow.document.write(`
      <div
        style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center;"
      >
        <div
          style="position: absolute; width: 80%; display: inline-block; background-color: #fff;"
        >
          ${value}
        <div>
      </div>
    `)
    myWindow.document.write(`
      <style>
        body {
          background-color: #ccc;
        }
      </style>
    `)

    myWindow.focus()
    myWindow.print()
  }, [])

  const selectDomValue = useCallback(() => {
    if (!!wrapComponentRef && !!wrapComponentRef.current) {
      const query =
        wrapComponentRef.current.getElementsByClassName('ck-content')[0]
          .innerHTML

      const doc = new DOMParser().parseFromString(query, 'text/html')
      const formatDoc = doc.body.innerHTML

      return formatHtml(formatDoc)
    }
    return ''
  }, [])

  useEffect(() => {
    if (isError) {
      setEditorError(!hdRequireVal(componentRef.current))
    } else {
      setEditorError(!!isError)
    }
  }, [isError, componentRef.current])

  useEffect(() => {
    if (data) {
      setFilledContent(clearStyle(data))
    }
  }, [data])

  return (
    <StyledWrapEditor
      className="wrapComponent"
      ref={wrapComponentRef}
      isError={editorError}
    >
      <EditorCustom data={filledContent} updateContent={handleChange} />

      <div className="text-left mt-3">
        {editorError && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {isError}
          </Form.Control.Feedback>
        )}
        {hdRequireVal(componentRef.current) && (
          <Button
            className="btn btn-info"
            onClick={() => {
              asPreview(selectDomValue())
            }}
          >
            Preview Your Content
          </Button>
        )}
      </div>
    </StyledWrapEditor>
  )
}

const StyledWrapEditor = styled.div`
  .ckeditorCustom {
    .ck-toolbar {
      border: ${props =>
        props.isError ? '1px solid #f54d63' : '1px solid #c4c4c4'};
    }
    .ck-content {
      border: ${props =>
        props.isError ? '1px solid #f54d63 !important' : '1px solid #c4c4c4'};
    }

    .ck-editor__editable_inline {
      min-height: 10em;
    }
  }
`

export default WrapEditorComponent
