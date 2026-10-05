import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Cropper from 'react-cropper'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { getIndustries, setFetchMeTime, updateCompany } from '../../states/auth'

export default function FormCompanyDetails() {
  const dispatch = useDispatch()
  const {
    industries,
    session: {
      user: { companies },
    },
    updatingCompany,
  } = useSelector(state => state.auth)
  const [company] = companies
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [showFieldLogo, setShowFieldLogo] = useState(true)
  const [newFile, setNewFile] = useState(null)
  const [cropModalVisible, setCropModalVisible] = useState(false)
  const cropperRef = useRef(null)

  /**
   * if company logo was already set, then hide upload field
   */
  useEffect(() => {
    if (company.logo) {
      setShowFieldLogo(false)
    } else {
      setShowFieldLogo(true)
    }
  }, [company])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
    watch,
    setValue,
  } = useForm()

  const watchLogo = watch('logo')

  /**
   * on submitting company details
   * @type {(function(*=): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      dispatch(
        updateCompany({
          ...values,
          ...(!values?.logo && { deletedLogo: company?.logo?.id }),
        })
      )
        .unwrap()
        .then(() => {
          // update saved profile
          dispatch(setFetchMeTime())

          toast.success('Company details are updated successfully.')
        })
        .catch(error => {
          toast.warn(error.message || 'Could not update company details')
        })
    },
    [dispatch, company]
  )

  useEffect(() => {
    reset({
      name: company.name || '',
      abn: company.abn || '',
      industry: company?.industry?.id || null,
    })
  }, [reset, company])

  /**
   * onload get all industries to fill in dropdown
   */
  useEffect(() => {
    dispatch(getIndustries())
  }, [dispatch])

  const onCrop = useCallback(() => {
    const imageElement = cropperRef?.current
    const cropper = imageElement?.cropper
    cropper.getCroppedCanvas().toBlob(blob => {
      const file = new File([blob], newFile?.name, { type: newFile?.type })
      setValue('logo', file)
    }, newFile?.type)
  }, [newFile])

  return (
    <div className="mt-5">
      <h5>Company Details</h5>

      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Row>
          <Col lg={6}>
            <Form.Group>
              <Form.Label htmlFor="name">Company name </Form.Label>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    required
                    {...field}
                    placeholder="Enter your company name"
                    isInvalid={!!errors.name}
                  />
                )}
                name="name"
                control={control}
                rules={{
                  required: 'Please enter company Name',
                }}
              />
              {errors && errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label htmlFor="abn">ABN Number</Form.Label>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    placeholder="Enter your ABN Number"
                    isInvalid={!!errors.abn}
                    pattern={'^(\\d *?){11}$'}
                  />
                )}
                name="abn"
                control={control}
                rules={{
                  pattern: {
                    value: /^(\d *?){11}$/g,
                    message: 'Please enter a valid ABN number',
                  },
                }}
              />
              {errors && errors.abn && (
                <Form.Control.Feedback type="invalid">
                  {errors.abn.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group>
              <Form.Label htmlFor="industry">Industry</Form.Label>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    as="select"
                    required
                    {...field}
                    isInvalid={!!errors.industry}
                  >
                    <option value="">Select</option>
                    <>
                      {industries.map(industry => (
                        <option key={industry.name} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </>
                  </Form.Control>
                )}
                name="industry"
                control={control}
                rules={{
                  required: 'Please select your company industry',
                }}
              />
              {errors && errors.industry && (
                <Form.Control.Feedback type="invalid">
                  {errors.industry.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col lg={6}>
            {showFieldLogo && (
              <Form.Group>
                <Form.Label htmlFor="logo">Company Logo</Form.Label>
                <Controller
                  render={({ field }) => (
                    <Form.File
                      label={watchLogo?.name || 'Upload your logo'}
                      custom
                      onChange={e => {
                        const file = e.target.files[0]
                        const imageUrl = URL.createObjectURL(file)
                        setNewFile(file)
                        setAvatarImageUrl(imageUrl)
                        setCropModalVisible(true)
                        field.onChange(file)
                      }}
                      isInvalid={!!errors.logo}
                      accept=".jpeg,.jpg,.png"
                    />
                  )}
                  name="logo"
                  control={control}
                />
                {errors && errors.logo && (
                  <Form.Control.Feedback type="invalid">
                    {errors.logo.message}
                  </Form.Control.Feedback>
                )}
                <p>Please upload PNG or JPG file up to 20 MB</p>
              </Form.Group>
            )}

            {!showFieldLogo && (
              <>
                <Form.Group>
                  <Form.Label>Current Logo</Form.Label>
                  <div>
                    <Card className="d-inline-flex">
                      <Card.Img
                        src={`${process.env.NEXT_PUBLIC_API}${company.logo.url}`}
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                      <Card.Footer className="text-center">
                        <Button
                          size="sm"
                          variant="light"
                          className="rounded-pill btn-icon"
                          onClick={() => {
                            setShowFieldLogo(true)
                            setValue('logo', null)
                          }}
                        >
                          <span className="btn-inner--icon">
                            <FontAwesomeIcon icon={faTimes} />
                          </span>
                          <span className="btn-inner--text">Delete</span>
                        </Button>
                      </Card.Footer>
                    </Card>
                  </div>
                </Form.Group>
              </>
            )}
          </Col>
        </Row>

        <Modal
          size="xl"
          show={cropModalVisible}
          onHide={() => setCropModalVisible(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Crop the image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Cropper
              src={avatarImageUrl}
              initialAspectRatio={1}
              guides={false}
              viewMode={1}
              dragMode="crop"
              responsive
              crop={onCrop}
              background={false}
              aspectRatio={1}
              autoCropArea={1}
              ref={cropperRef}
            />
            <div className="text-center">
              <Button
                variant="primary"
                className="btn-icon mt-3"
                onClick={() => setCropModalVisible(false)}
              >
                <span className="btn-inner--text">Save</span>
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Button
          variant="primary"
          type="submit"
          disabled={updatingCompany}
          className="btn-icon"
        >
          {updatingCompany && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
          <span className="btn-inner--text">Save</span>
        </Button>
      </Form>
    </div>
  )
}
