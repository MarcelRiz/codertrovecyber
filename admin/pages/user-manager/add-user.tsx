import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import styled from 'styled-components'
import * as Icon from 'react-feather'
import { Select } from 'antd'
import DefaultLayout from '@src/layout/default'
import { Breadcrumb, Loading } from '@src/components'
import { useAppDispatch, useAppSelector } from '@src/states/hooks'
import {
  createUser,
  selectUserPofile,
  setError,
} from '@src/states/features/userProfileSlice'
import {
  getDepartments,
  selectDepartment,
} from '@src/states/features/departmentSlice'
import styles from './styles.module.scss'

const { Option } = Select
export default function AddUser() {
  const dispatch = useAppDispatch()
  const { pending, error } = useAppSelector(selectUserPofile)
  const { departments } = useAppSelector(selectDepartment)
  const [session] = useSession()
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm()

  const onSubmit = useCallback(values => {
    async function addUser(params) {
      const response = await dispatch(
        createUser({
          ...params,
          parents: [session?.id],
        })
      )
      if (response?.payload) {
        router.back()
      }
    }
    dispatch(setError(''))
    addUser(values)
  }, [])

  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    dispatch(getDepartments())
    dispatch(setError(''))
    return () => {
      dispatch(setError(''))
    }
  }, [])

  return (
    <DefaultLayout>
      {pending && <Loading />}
      <Breadcrumb>
        <span className="breadcrumb-icon">
          <Icon.User />
        </span>
        <Link href="/user-manager">User Management </Link>/ Add User
      </Breadcrumb>
      <div className="page-container">
        <div className="row">
          <div className="col-12">
            <div className="card card-fluid justify-content-center">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h1 className="d-block h3 mb-0">Add New User</h1>
                  </div>
                  <div className="col-auto">
                    <div
                      className="text-right link"
                      onClick={goBack}
                      aria-hidden="true"
                    >
                      <i className="fas fa-chevron-left"></i> Back
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
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
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
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
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
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
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
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
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="fullName">Company Name</Form.Label>
                    <InputGroup>
                      <Controller
                        render={({ field }) => (
                          <Form.Control
                            type="text"
                            placeholder="Company Name"
                            {...field}
                            isInvalid={!!errors.company}
                          />
                        )}
                        control={control}
                        name="company"
                        rules={{
                          required: true,
                        }}
                      />
                      {errors && errors.company && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          Company Name is required.
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="departmentId">Department</Form.Label>
                    <Controller
                      name="departmentId"
                      control={control}
                      render={({ field }) => (
                        <StyledSelect
                          isError={errors.departmentId && true}
                          className={styles.departmentSelect}
                          showSearch
                          size="large"
                          placeholder="Select department"
                          optionFilterProp="children"
                          allowClear
                          {...field}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
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
                  </Form.Group>
                  <div className="text-right">
                    <Button type="submit" className="btn  btn-primary">
                      Create New User
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border: ${props => props.isError && '1px solid red !important'};
    height: 5vh !important;
    display: flex;
    align-items: center;
    border-radius: ${props =>
      props.isError
        ? '0.375rem 0 0 0.375rem !important'
        : '0.375rem !important'};
    padding: 0 1.4em !important;
    :hover {
      border-color: ${props => !props.isError && 'blueviolet !important'};
    }
    :focus-within {
      border-color: rgba(70, 21, 214, 0.5) !important;
      box-shadow: 0 0 2px 2px rgba(69, 21, 214, 0.26) !important;
    }
  }
`
