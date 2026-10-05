import React, { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import CustomEditor from '@8trhieu/ckeditor5-build-classic-custom'
// import { getCsrfToken } from 'next-auth/client'
import { fatherToolbar, imageToolbar, tableToolbar } from './config'

const CKEditorCustom = ({ data, updateContent }) => {
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  // const [configEditor, setConfigEditor] = useState({})
  // const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    setIsLayoutReady(true)
  }, [])

  // useMemo(async() => {
  //   await getCsrfToken().then(csrf => {
  //     setCsrfToken(csrf)
  //   })
  // }, [])

  return (
    <div className="ckeditorCustom">
      {isLayoutReady ? (
        <CKEditor
          data={data}
          // eslint-disable-next-line no-unused-vars
          onReady={editor => {
            console.log('Editor is ready to use!')
            // editor.setData(data)
            // setConfigEditor(editor)
          }}
          onError={err => {
            console.log('Error ', err)
            if (err.willEditorRestart) {
              // editor.setData( 'Something when wrong.' )
            }
          }}
          config={{
            // ...configEditor,
            // placeholder: '.',
            // removePlugins: ['Markdown'],
            toolbar: fatherToolbar,
            image: imageToolbar,
            table: tableToolbar,
            simpleUpload: {
              // The URL that the images are uploaded to.
              uploadUrl: `${process.env.NEXT_PUBLIC_API_URL}/file-google-storages/uploadFileLite`,
              // Enable the XMLHttpRequest.withCredentials property.
              withCredentials: false,
              // Headers sent along with the XMLHttpRequest to the upload server.
              headers: {
                // 'X-CSRF-TOKEN': 'CSRF-Token',
                // 'X-CSRF-TOKEN': csrfToken,
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
              },
            },
          }}
          onChange={(event, editor) => {
            updateContent(editor.getData())
          }}
          editor={CustomEditor}
        />
      ) : (
        <div>Editor loading...</div>
      )}
    </div>
  )
}

export default CKEditorCustom
