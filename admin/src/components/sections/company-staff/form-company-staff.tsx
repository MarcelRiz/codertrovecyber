import React, { useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { Select } from 'antd'
import { useAppSelector } from '@states/hooks'
import { selectDepartment } from '@src/states/features/departmentSlice'
import { StyledSelect } from './buildInComponent.styled'

const { Option } = Select
export default function FormCompanyStaff({
  onUpdateUser,
  onCancel,
  data,
  loading,
}) {
  const { departments } = useAppSelector(selectDepartment)
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    setValue,
  } = useForm()

  const onSubmit = useCallback(values => {
    if (values.departmentId && values.departmentId.id) {
      onUpdateUser({
        ...values,
        departmentId: values.departmentId.id,
      })
    } else {
      onUpdateUser(values)
    }
  }, [])

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key] || '')
      })
    }
  }, [data])

  const selectedDepartment = useCallback(
    selectVal => {
      if (selectVal && selectVal.id) {
        return selectVal.id
      }
      return selectVal
    },
    [departments]
  )

  return (
    <>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <Form.Label htmlFor="fullName">First Name</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  {...field}
                  isInvalid={!!errors.firstName}
                />
              )}
              control={control}
              name="firstName"
              rules={{
                required: true,
              }}
            />
            {errors && errors.firstName && (
              <Form.Control.Feedback type="invalid" className="d-block">
                First Name is required.
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="lastName">Last Name</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Last Name"
                  {...field}
                  isInvalid={!!errors.lastName}
                />
              )}
              control={control}
              name="lastName"
              rules={{
                required: true,
              }}
            />
            {errors && errors.lastName && (
              <Form.Control.Feedback type="invalid" className="d-block">
                Last Name is required.
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="email"
                  placeholder="Email"
                  {...field}
                  isInvalid={!!errors.email}
                />
              )}
              control={control}
              name="email"
              rules={{
                required: 'Please enter your email address',
              }}
            />
            {errors && errors.email && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="phone">Mobile Number</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="number"
                  placeholder="Mobile"
                  {...field}
                  isInvalid={!!errors.phone}
                />
              )}
              control={control}
              name="phone"
              rules={{
                required: true,
              }}
            />
            {errors && errors.phone && (
              <Form.Control.Feedback type="invalid" className="d-block">
                Mobile is required.
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="departmentId">Department</Form.Label>
          <Controller
            name="departmentId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <StyledSelect
                isError={errors.departmentId && true}
                className="d-block"
                showSearch
                size="large"
                placeholder="Select department"
                optionFilterProp="children"
                allowClear
                {...field}
                value={selectedDepartment(field.value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {departments.length > 0 &&
                  departments.map(department => (
                    <Option key={department.id} value={department.id}>
                      {department.name}
                    </Option>
                  ))}
              </StyledSelect>
            )}
          />
          {errors && errors.departmentId && (
            <Form.Control.Feedback type="invalid" className="d-block">
              Department is required.
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <div className="text-right">
          <div className="text-right mt-4">
            <Button
              type="button"
              className="btn-sm"
              variant="secondary"
              disabled={loading}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn-sm"
              variant="primary"
              disabled={loading}
            >
              {loading && <Spinner animation="border" size="sm" />}
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  )
}
