import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import * as Icon from 'react-feather'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useAppSelector, useAppDispatch } from '../../../states/hooks'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { getReportTypes, selectActionReport } from '../../../states/features/actionReportsSlice'
import { IsFilePDF } from '../../../utilities/helps'

export default function FormReportItem({ onCreateActionItem, onUpdateActionItem, onCancel, data, loading = false }) {
  const dispatch = useAppDispatch()
  const readOnly = true
  const router = useRouter()
  const { user } = useAppSelector(selectUserPofile)
  const { reportTypes } = useAppSelector(selectActionReport)
  const [pdfFile, setPdfFile] = useState()
  const [messageError, setMessageError] = useState('')
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    register,
    setValue
  } = useForm()

  const onSubmit = useCallback((values) => {
    if (data) {
      onUpdateActionItem(values)
    } else {
      onCreateActionItem(values)
    }
  }, [router])

  const onChangeFile = (event) => {
    const file = event.target.files[0]
    if (!IsFilePDF(file)) {
      setMessageError('Please select PDF file with extension .pdf')
      setValue('reportFile', '')
      return
    }
    setMessageError('')
  }

  useEffect(() => {
    setValue('userName', `${user?.firstName || ''} ${user?.lastName || ''}`)
    setValue('userId', user?.id)
  }, [user])

  useEffect(() => {
    dispatch(getReportTypes())
  }, [])

  useEffect(() => {
    if (!data) {
      return
    }
    Object.keys(data).forEach(key => {
      setValue(key, data[key])
      if (key === 'reportType') {
        setValue('reportType', data[key]?.id)
      }
    })
    setPdfFile(data?.pdf?.name)
  }, [data])

  return (
    <>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <Form.Label htmlFor="actionItemSummary">Report Name</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Report Name"
                  {...field}
                  isInvalid={!!errors.name}
                />
              )}
              control={control}
              name="name"
              rules={{
                required: true
              }}
            />
            {errors && errors.name && (
              <Form.Control.Feedback type="invalid">
                Report Name is required.
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group className="in-validate">
          <Form.Label htmlFor="report_file">Report PDF</Form.Label>
          {pdfFile && (<div className="d-flex items-center">
            <span >{pdfFile} </span>
            <button onClick={() => setPdfFile(null)} className="btn btn-default p-0 ml-2 text-danger" type="button" aria-label="Remove"><Icon.X /></button>
          </div>)}
          {
            !pdfFile && (<Form.File name="report_file" id="report_file" {...register('reportFile', { required: true })} accept="application/pdf" onChange={onChangeFile} />)
          }
          {!pdfFile && errors && errors.reportFile && (
            <Form.Control.Feedback type="invalid">
              Report PDF is required.
            </Form.Control.Feedback>
          )}
          {messageError && !errors.reportFile &&
            (<span className="text-danger">
              {messageError}
            </span>
            )}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="reportType">Report type</Form.Label>
          <Form.Control name="reportType" placeholder="Select..." defaultValue="" as="select" {...register('reportType', { required: true })}>
            {reportTypes.map(item => (
              <option key={item.id} value={item.id}>{item?.name}</option>
            ))}
          </Form.Control>
          {errors && errors.reportType && (
            <Form.Control.Feedback type="invalid">
              Report Type is required.
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="customer">Customer</Form.Label>
          <Controller
            render={({ field }) => (
              <Form.Control
                type="text"
                placeholder=""
                {...field}
                readOnly={readOnly}
              />
            )}
            control={control}
            name="userName"
          />
        </Form.Group>
        <input type="hidden" {...register('userId')} />
        <div className="text-right mt-4">
          <Button type="button" className="btn-sm" variant="secondary" disabled={loading} onClick={onCancel}>
            Close
          </Button>
          <Button type="submit" className="btn-sm" variant="primary" disabled={loading}>
            {loading && <Spinner animation="border" variant="secondary" size="sm" />}
            {!data && 'Save'}
            {data && 'Update'}
          </Button>
        </div>
      </Form>
    </>
  )
}