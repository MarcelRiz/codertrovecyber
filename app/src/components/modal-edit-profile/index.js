/* eslint-disable import/no-unresolved */
import React, { useCallback, useEffect } from 'react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { User as IconUser } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Select } from 'antd'
import { toggleEditProfileModal } from '@states/common'
import { setFetchMeTime, updateProfile, getDepartment } from '@states/auth'
import { EMAIL_REGEX } from '@src/constants'
import { StyledSelect } from './buildInComponent.styled'
import styles from './styles.module.scss'

const { Option } = Select
export default function ModalEditProfile() {
  const { departments } = useSelector(state => state.auth)
  const showEditProfileModal = useSelector(
    state => state.common.showEditProfileModal
  )
  const user = useSelector(state => state.auth?.session?.user)
  const { updatingProfile } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
  } = useForm()

  useEffect(() => {
    dispatch(getDepartment())
  }, [])

  useEffect(() => {
    if (showEditProfileModal) {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        departmentId: user?.departmentId || '',
      })
    }
  }, [reset, showEditProfileModal, user])

  /**
   * on submitting info
   * @type {(function(*=): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      dispatch(updateProfile(values))
        .unwrap()
        .then(() => {
          toast.success('Your profile is updated successfully.')

          dispatch(setFetchMeTime())

          dispatch(toggleEditProfileModal(false))
        })
        .catch(error => {
          toast.warn(error.message || 'Could not update your profile!')
        })
    },
    [dispatch]
  )

  const selectedDepartment = useCallback(selectVal => {
    if (selectVal && selectVal.id) {
      return selectVal.id
    }
    return selectVal
  }, [])

  return (
    <Modal
      show={showEditProfileModal}
      onHide={() => {
        dispatch(toggleEditProfileModal(false))
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          id="edit-profile"
          name="edit-profile"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="firstName">Name</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    placeholder="First name"
                    {...field}
                    isInvalid={!!errors.firstName}
                    required
                  />
                )}
                control={control}
                name="firstName"
                rules={{
                  required: 'Please enter your first name',
                }}
              />
              <Controller
                render={({ field }) => (
                  <Form.Control
                    placeholder="Last name"
                    {...field}
                    isInvalid={!!errors.lastName}
                    required
                  />
                )}
                control={control}
                name="lastName"
                rules={{
                  required: 'Please enter your last name',
                }}
              />
              {errors && errors.firstName && (
                <Form.Control.Feedback type="invalid">
                  {errors.firstName.message}
                </Form.Control.Feedback>
              )}
              {errors && errors.lastName && (
                <Form.Control.Feedback type="invalid">
                  {errors.lastName.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">Email address</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                    required
                    isInvalid={!!errors.email}
                  />
                )}
                control={control}
                name="email"
                rules={{
                  required: 'Please enter your email address',
                  pattern: {
                    value: EMAIL_REGEX,
                    message: 'Please enter a valid email address',
                  },
                }}
              />
              {errors && errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="phone">Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="tel"
                    placeholder="+840499949494"
                    {...field}
                    required
                    isInvalid={!!errors.phone}
                  />
                )}
                control={control}
                name="phone"
                rules={{
                  required: 'Please enter your phone number',
                }}
              />
              {errors && errors.phone && (
                <Form.Control.Feedback type="invalid">
                  {errors.phone.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="departmentId">Department</Form.Label>
            <div className="d-flex">
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconUser />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                name="departmentId"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <StyledSelect
                    isError={errors}
                    className={styles.selectDepartment}
                    showSearch
                    size="large"
                    placeholder="Select department"
                    optionFilterProp="children"
                    allowClear
                    {...field}
                    value={selectedDepartment(field.value)}
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
            </div>
            {errors && errors.departmentId && (
              <Form.Control.Feedback type="invalid" className="d-block">
                Department is required.
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          className="btn btn-primary btn-icon"
          form="edit-profile"
          disabled={updatingProfile}
        >
          {updatingProfile && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            </span>
          )}
          <span className="btn-inner--text">Update</span>
        </Button>
        <Button
          className="btn btn-primary"
          variant="light"
          onClick={() => {
            dispatch(toggleEditProfileModal(false))
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
