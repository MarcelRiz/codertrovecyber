import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import * as Icon from 'react-feather'
import Head from 'next/head'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import { selectCompany, updateCompany } from '../../../states/features/companySlice'
import { getIndustries, selectIndustry } from '../../../states/features/industrySlice'
import { addFile, selectfile } from '../../../states/features/fileSlice'
import Loading from '../../loading'
import { IsFileImage } from '../../../utilities/helps'

export default function CompanyDetails() {
  const [stateForm, setstateForm] = useState(0)
  const [messageError, setMessageError] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const dispatch = useAppDispatch()
  const { company, pending } = useAppSelector(selectCompany)
  const { entities } = useAppSelector(selectIndustry)
  const { file } = useAppSelector(selectfile)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    setValue
  } = useForm()

  const onSubmit = useCallback((values) => {
    dispatch(updateCompany({
      id: company.id,
      name: values.name,
      industry: values.industry,
      logo: values.logo,
      abn: values.abn
    }))
    setstateForm(0)
  }, [])

  const onFileChange = useCallback((event) => {
    async function uploadFile(params) {
      const fileUrl = params.target.files[0]
      if(!IsFileImage(fileUrl)) {
        setMessageError('Please select image file with extension .jpg .jpeg .gif .png')
        return
      }
      if (fileUrl?.size / 1024 > 500) {
        setMessageError('The image size maximun 500kb')
        return
      }
      setMessageError('')
      await dispatch(addFile({ file: fileUrl }))
    }
    uploadFile(event)
  }, [])

  useEffect(() => {
    setValue('logo', file.id)
    setImagePreview(file.url)
  }, [file])

  useEffect(() => {
    if(company?.logo?.url) {
      setImagePreview(company.logo.url)
    }    
    Object.keys(company).forEach(key => {
      if(key === 'industry') {
        setValue('industry', company[key]?.id)
      } else {
        setValue(key, company[key])
      }          
    })
  }, [company, entities])

  useEffect(() => {
    async function getList() {
      await dispatch(getIndustries())
    }
    getList()
  }, [])

  return (
    <>
      <Head>
        <title>Continuumcyber - Company Details</title>
      </Head>
      {pending && <Loading />}
      <h3>Company Details</h3>
      <div className="card-body">
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="companyName">Company Name</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Company Name"
                    {...field}
                    isInvalid={!!errors.name}
                    readOnly={stateForm === 0}
                  />
                )}
                control={control}
                name="name"
                rules={{
                  required: true
                }}
                defaultValue=""
              />
              {errors && errors.name && (
                <Form.Control.Feedback type="invalid">
                  Company Name is required.
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="abn">ABN</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="ABN"
                    {...field}
                    readOnly={stateForm === 0}
                  />
                )}
                control={control}
                name="abn"
                defaultValue=""
              />
              {errors && errors.abn && (
                <Form.Control.Feedback type="invalid">
                  ABN is required.
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="industry">Industry</Form.Label>
            <Form.Control as="select" {...register('industry')} disabled={stateForm === 0} defaultValue="">
              {entities?.map(item =>
                <option  key={item.id} value={item.id}>{item.name}</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3 mt-2">
            <Form.Label htmlFor="companyLogo">Company logo (max size 500kb)</Form.Label>
            <div className="mt-0 file-container">
              {imagePreview && <div className="imgPreview text-right" style={{
                backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}${imagePreview})`
              }}>
                {stateForm !== 0 && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setImagePreview('')}>
                  <i className="far fa-trash-alt text-danger"></i>
                </button>}
              </div>}
              {!imagePreview &&
                (
                  <>
                    <input type="file" name="companyLogo" accept="image/png, image/gif, image/jpeg" disabled={stateForm === 0} className="custom-input-file" onChange={onFileChange} />
                    <Form.Label htmlFor="companyLogo">
                      <Icon.Upload />
                      <span>Choose a file…</span>
                    </Form.Label>
                  </>
                )
              }
              <input type="hidden" {...register('logo')} />
            </div>
            {messageError && (<div className="in-validate"><Form.Control.Feedback type="invalid">
              {messageError}
            </Form.Control.Feedback></div>)}
          </Form.Group>
          <div className="text-right">
            {stateForm === 0 && (<div className="text-right">
              <Button type="submit" onClick={() => { setstateForm(1) }} className="btn btn-primary">
                Edit
              </Button>
            </div>)}
            {stateForm === 1 && (<div className="text-right">
              <Button type="submit" onClick={() => { setstateForm(1) }} className="btn btn-primary">
                Save
              </Button>
              <Button type="button" onClick={() => { setstateForm(0) }} className="btn btn-secondary">
                Cancel
              </Button>
            </div>)}
          </div>
        </Form>
      </div>
    </>
  )
}