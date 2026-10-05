import React, { useCallback, useEffect } from 'react'
import { Button, Form, InputGroup, Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { Key as IconKey } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { toggleChangePasswordModal } from '../../states/common'
import { PASSWORD_REGEX } from '../../constants'
import PasswordStrengthCheck from '../password-strength-check'
import { changePassword } from '../../states/auth'

export default function ModalChangePassword() {
  const showChangePasswordModal = useSelector(
    state => state.common.showChangePasswordModal
  )
  const { changingPassword } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
    watch,
  } = useForm()

  const watchPassword = watch('password')

  useEffect(() => {
    if (showChangePasswordModal) {
      reset({
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
      })
    }
  }, [reset, showChangePasswordModal])

  /**
   * on submitting info
   * @type {(function(*=): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      dispatch(changePassword(values))
        .unwrap()
        .then(() => {
          toast.success('Your password is updated successfully.')
          dispatch(toggleChangePasswordModal(false))
        })
        .catch(error => {
          toast.error(error.message || 'Could not update your password')
        })
    },
    [dispatch]
  )

  return (
    <Modal
      show={showChangePasswordModal}
      onHide={() => {
        dispatch(toggleChangePasswordModal(false))
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-primary">
          Please change your default password to keep your account secured.
        </div>
        <Form
          id="change-password"
          name="change-password"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="currentPassword">Current password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    placeholder="Current password"
                    {...field}
                    isInvalid={!!errors.currentPassword}
                    required
                  />
                )}
                control={control}
                name="currentPassword"
                rules={{
                  required: 'Please enter your current password',
                }}
              />
              {errors && errors.currentPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="password">New Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    placeholder="New Password"
                    {...field}
                    required
                    isInvalid={!!errors.email}
                  />
                )}
                control={control}
                name="password"
                rules={{
                  required: 'Please enter your new password',
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: 'Please enter a valid password',
                  },
                }}
              />
              {errors && errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>

          <PasswordStrengthCheck
            password={watchPassword}
            show={!!watchPassword}
          />

          <Form.Group>
            <Form.Label htmlFor="passwordConfirmation">
              New password confirm
            </Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <IconKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    placeholder="New password confirm"
                    {...field}
                    required
                    isInvalid={!!errors.passwordConfirmation}
                  />
                )}
                control={control}
                name="passwordConfirmation"
                rules={{
                  required: 'Please enter your new password confirm',
                  validate: {
                    compare(value) {
                      return value === watchPassword || 'Passwords don’t match'
                    },
                  },
                }}
              />
              {errors && errors.passwordConfirmation && (
                <Form.Control.Feedback type="invalid">
                  {errors.passwordConfirmation.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          className="btn btn-primary btn-icon"
          form="change-password"
          disabled={changingPassword}
        >
          {changingPassword && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
          <span className="btn-inner--text">Update</span>
        </Button>
        <Button
          className="btn btn-primary"
          variant="light"
          onClick={() => {
            dispatch(toggleChangePasswordModal(false))
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
