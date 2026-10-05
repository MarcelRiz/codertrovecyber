import React, { useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { get, isEmpty } from 'lodash'
import { useAppDispatch, useAppSelector } from '@src/states/hooks'
import {
  getFile,
  getSignatureCreateFile,
  selectUploadFileManagement,
  setIsUploadedFile,
  uploadFileToGCS,
  removeFile,
  setIsSubmitFile,
} from '@src/states/features/uploadFileManagementSlice'
import usePrevious from '@hooks/usePrevious'

const InitImageFile = {
  name: '',
  type: '',
  dataFile: null,
}
const UploadInputComponent = ({
  onDone,
  data,
  isError = false,
  type = 'file' || 'image',
  btnTitle = 'Upload Image',
  accept = 'image/*',
  multiple = false,
  isAddPage = false,
}) => {
  const [fileState, setFileState] = useState(InitImageFile)
  // const [uploadedFile, setUploadedFile] = useState('')
  const uploadedFile = useRef('')
  const dispatch = useAppDispatch()
  const { signatureCreateFile, currentFile, isUploadedFile } = useAppSelector(
    selectUploadFileManagement
  )
  const prevSignatureCreateFile = usePrevious(signatureCreateFile)

  useEffect(() => {
    dispatch(setIsUploadedFile(false))
    setFileState(InitImageFile)
  }, [])

  useEffect(() => {
    if (!isAddPage) {
      dispatch(setIsSubmitFile(true))
    }
    if (!isAddPage && !isEmpty(get(signatureCreateFile, 'pathName'))) {
      dispatch(setIsSubmitFile(false))
    }
  }, [isAddPage, signatureCreateFile])

  useEffect(() => {
    if (data && data.name) {
      setFileState(data)
      dispatch(
        getFile({
          pathName: data.pathName,
        })
      )
    }

    if (data && data.pathName) {
      // setUploadedFile(data.pathName)
      uploadedFile.current = data.pathName
    }
  }, [data])

  useEffect(() => {
    const pathName = get(signatureCreateFile, 'pathName')
    const prevPathName = get(prevSignatureCreateFile, 'pathName')

    if (
      !!currentFile.pathName &&
      !!uploadedFile.current &&
      currentFile.pathName !== uploadedFile.current
    ) {
      dispatch(
        removeFile({
          pathName: currentFile.pathName,
        })
      )
    }
    if (isAddPage && prevPathName && pathName !== prevPathName) {
      dispatch(
        removeFile({
          pathName: prevPathName,
        })
      )
    }

    if (
      signatureCreateFile &&
      fileState.dataFile &&
      pathName !== prevPathName
    ) {
      dispatch(
        uploadFileToGCS({
          preSignedUrl: signatureCreateFile.preSignedUrl,
          dataFile: fileState.dataFile,
        })
      )
    }
  }, [signatureCreateFile, currentFile, prevSignatureCreateFile, isAddPage])

  useEffect(() => {
    const pathName = get(signatureCreateFile, 'pathName')
    const prevPathName = get(prevSignatureCreateFile, 'pathName')

    if (pathName !== prevPathName) {
      dispatch(
        getFile({
          pathName: signatureCreateFile.pathName,
        })
      )
    }

    if (
      // isUploadedFile && signatureCreateFile && pathName !== prevPathName
      isUploadedFile &&
      pathName
    ) {
      onDone({
        name: fileState.name,
        type: fileState.type,
        pathName,
      })
    }
  }, [isUploadedFile, signatureCreateFile, prevSignatureCreateFile])

  const getSignedUrlToStore = useCallback(async fileName => {
    dispatch(
      getSignatureCreateFile({
        fileName,
      })
    )
  }, [])

  const handleChange = useCallback(async e => {
    try {
      const { files } = e.target
      const item = files[0]

      // request signed url to upload file
      await getSignedUrlToStore(item.name)

      setFileState({
        name: item.name,
        type: item.type,
        dataFile: item,
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }, [])

  const previewImage = useCallback(selectedImage => {
    const myWindow = window.open()
    myWindow.document.write(`
      <div style="display: flex; justify-content: center;">
        <img src=${selectedImage} alt="Red dot" />
      </div>
    `)

    myWindow.focus()
    myWindow.print()
  }, [])

  return (
    <StyledInput isError={isError}>
      <div className="custom-btn-upload">
        <i className="fa fa-upload" aria-hidden="true">
          {btnTitle}
        </i>
        {type === 'file' && (
          <input
            type="file"
            className="customFileUpload"
            onChange={e => handleChange(e)}
            multiple={multiple}
            accept={
              accept ||
              '.doc, .docx, .xml, application/msword , application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            }
          />
        )}
        {type === 'image' && (
          <input
            type="file"
            className="customFileUpload"
            onChange={e => handleChange(e)}
            multiple={multiple}
            accept={accept || 'image/*'}
          />
        )}
      </div>
      {fileState && fileState.name && currentFile && currentFile.preSignedUrl && (
        <div
          key={fileState.name}
          className="fileName"
          role="presentation"
          onClick={() => previewImage(currentFile.preSignedUrl)}
        >
          <i className="fa fa-image" aria-hidden="true">
            {fileState.name}
          </i>
        </div>
      )}
    </StyledInput>
  )
}

const StyledInput = styled.div`
  .custom-btn-upload {
    input[type='file'] {
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 1;
      position: absolute;
    }
    i {
      margin-left: 1.4em;
      display: flex;
      gap: 1em;
      justify-items: center;
      align-items: center;
      width: 30%;
      position: relative;
    }
    position: relative;
    cursor: pointer;
    border: ${props =>
      props.isError ? '1px solid #f54d63' : '1px solid #ccc'};
    height: 5vh;
    display: flex;
    align-items: center;
    border-radius: ${props =>
      props.isError ? '0.375rem 0 0 0.375rem' : '0.375rem'};
    :hover {
      border-color: ${props => !props.isError && 'blueviolet'};
    }
    :focus-within {
      border-color: rgba(70, 21, 214, 0.5);
      box-shadow: 0 0 2px 2px rgba(69, 21, 214, 0.26);
    }
  }
  .fileName {
    margin-top: 1em;
    margin-left: 2em;
    i {
      display: flex;
      gap: 2em;
      color: #ff0000a9;
      cursor: pointer;
    }
  }
`

export default UploadInputComponent
