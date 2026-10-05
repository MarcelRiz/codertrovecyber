import React, { useCallback, useEffect, useMemo } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { Type as IconName } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import StorageService from '@src/services/StorageService'
import { toast } from 'react-toastify'
import { getDepartment, getIndustries } from '../../states/auth'

export default function CompanyInfoForm({
  prevFormStep,
  nextFormStep,
  defaultValues,
}) {
  const dispatch = useDispatch()
  const { industries, departments } = useSelector(state => state.auth)

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitted },
    getValues,
    reset,
  } = useForm({
    defaultValues,
  })

  const watchLogo = watch('logo')

  useEffect(() => {
    dispatch(getIndustries())
    dispatch(getDepartment())
  }, [dispatch])

  useEffect(() => {
    if (!watchLogo?.name) {
      localStorage.removeItem('file')
      localStorage.removeItem('fileName')
    } else {
      const reader = new FileReader()
      reader.onload = function (base64) {
        localStorage.file = base64.target.result
        localStorage.fileName = watchLogo.name
      }
      reader.readAsDataURL(watchLogo)
    }
  }, [watchLogo])

  const departmentOptions = useMemo(
    () =>
      departments.reduce((acc, curr) => {
        acc.push({
          label: curr.name,
          value: curr.id,
        })
        return acc
      }, []),
    [departments]
  )

  const industryOptions = useMemo(
    () =>
      industries.map(industry => ({
        label: industry.name,
        value: `${industry.id}`,
      })),
    [industries]
  )

  const handleClickPrev = useCallback(() => {
    const cached = StorageService.getSignUpInfo()
    StorageService.setSignUpInfo({
      ...cached,
      company: getValues('company'),
      logo: getValues('logo'),
      abn: getValues('abn'),
      industry: getValues('industry'),
      departmentId: getValues('departmentId'),
    })
    prevFormStep()
  }, [])

  useEffect(() => {
    const cached = StorageService.getSignUpInfo()
    let file
    if (localStorage.file) {
      const base64 = localStorage.file
      const extension = localStorage.fileName.split('.')[1]
      const base64Parts = base64.split(',')
      const fileContent = base64Parts[1]
      file = new File([fileContent], localStorage.getItem('fileName'), {
        type: `image/${extension}`,
      })
    }

    reset({
      company: cached?.company,
      abn: cached?.abn,
      industry: cached?.industry,
      departmentId: cached?.departmentId,
      phone: cached?.phone,
      logo: file,
    })
  }, [])

  const onSubmit = async values => {
    try {
      const accountData = StorageService.getSignUpInfo()
      const payload = {
        ...accountData,
        ...values,
      }
      StorageService.setSignUpInfo(payload)
      nextFormStep()
    } catch (error) {
      toast.error(error?.message || 'Register account failed.')
    }
  }

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} validated={isSubmitted}>
      <Form.Group>
        <Form.Label htmlFor="name">Company Name</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <IconName />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Controller
            render={({ field }) => (
              <Form.Control
                placeholder="Enter your company name"
                {...field}
                required
                isInvalid={!!errors.name}
              />
            )}
            control={control}
            name="company"
            rules={{
              required: 'Please enter your company name',
            }}
          />
          {errors && errors.company && (
            <Form.Control.Feedback type="invalid">
              {errors.company.message}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="logo">Company Logo</Form.Label>
        <Controller
          render={({ field }) => (
            <Form.File
              label={watchLogo?.name || 'Upload your logo'}
              custom
              onChange={e => field.onChange(e.target.files[0])}
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
      </Form.Group>
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
      <Form.Group>
        <Form.Label htmlFor="industry">Industry</Form.Label>
        <Controller
          render={({ field }) => (
            <Select
              {...field}
              options={industryOptions}
              isClearable
              placeholder="Select industry"
              value={field?.value}
            />
          )}
          name="industry"
          control={control}
          rules={{
            required: 'Please select the industry!',
          }}
        />
        {errors && errors.industry && (
          <Form.Text className="text-danger">
            {errors.industry.message}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="d-flex flex-column">
        <Form.Label htmlFor="departmentId">Department</Form.Label>
        <Controller
          render={({ field }) => (
            <Select
              options={departmentOptions}
              placeholder="Select department"
              isClearable
              {...field}
              value={field.value}
            />
          )}
          name="departmentId"
          control={control}
        />
        {errors && errors.departmentId && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {errors.departmentId.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="phone">Mobile phone</Form.Label>
        <Controller
          render={({ field }) => (
            <Form.Control
              type="tel"
              {...field}
              isInvalid={!!errors.phone}
              placeholder="Enter phone number"
              pattern="^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$"
            />
          )}
          name="phone"
          control={control}
          rules={{
            pattern: {
              value:
                /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
              message: 'Please enter a valid phone number',
            },
          }}
        />
        {errors && errors.phone && (
          <Form.Control.Feedback type="invalid">
            {errors.phone.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button type="submit" className="btn btn-block btn-primary btn-icon m-0">
        <span className="btn-inner--text">Next</span>
      </Button>{' '}
      <Button
        className="btn btn-block btn-secondary btn-icon m-0 mt-2"
        onClick={handleClickPrev}
      >
        <span className="btn-inner--text">Back</span>
      </Button>{' '}
    </Form>
  )
}
