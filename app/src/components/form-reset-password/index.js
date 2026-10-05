import React, { useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap'
import { Key as IconKey } from 'react-feather'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { resetPassword } from '../../states/auth'
import UserService from '../../services/UserService'
import { PASSWORD_REGEX } from '../../constants'
import PasswordStrengthCheck from '../password-strength-check'

export default function FormResetPassword() {
  const { resettingPassword } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const router = useRouter()
  const { code } = router.query
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    watch,
  } = useForm()

  const watchPassword = watch('password')

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const { password, passwordConfirmation } = values
      dispatch(resetPassword({ code, password, passwordConfirmation }))
        .unwrap()
        .then(data => {
          UserService.saveSession(data, true)
          toast.success('Password reset successfully!')
          router.push('/')
        })
        .catch(error => {
          toast.warn(error.message || 'Could not reset password')
        })
    },
    [code, dispatch]
  )

  return (
    <>
      <div className="mb-5 text-center">
        <h6 className="h3 mb-1">Reset password</h6>
        <p className="text-muted mb-0">Set new password for your account</p>
      </div>
      <span className="clearfix" />

      {!code && <Alert variant="warning">Reset password token not found</Alert>}

      {code && (
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="password">Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text className="input-group-text">
                  <IconKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...field}
                    required
                    isInvalid={!!errors.password}
                  />
                )}
                name="password"
                control={control}
                rules={{
                  required: 'Please enter your password',
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

          <Form.Group>
            <Form.Label htmlFor="passwordConfirmation">
              Password confirm
            </Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text className="input-group-text">
                  <IconKey />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    id="passwordConfirmation"
                    placeholder="Password"
                    {...field}
                    required
                    isInvalid={!!errors.passwordConfirmation}
                  />
                )}
                name="passwordConfirmation"
                control={control}
                rules={{
                  required: 'Please enter your password',
                  validate: {
                    compare(value) {
                      return (
                        value === watchPassword ||
                        'Password and confirm does not match'
                      )
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

          <PasswordStrengthCheck
            password={watchPassword}
            show={!!watchPassword}
          />

          <div className="mt-4">
            <Button
              type="submit"
              className="btn-block btn-icon"
              variant="primary"
              disabled={resettingPassword}
            >
              {resettingPassword && (
                <span className="btn-inner--icon">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </span>
              )}
              <span className="btn-inner--text">Reset</span>
            </Button>
          </div>
          <div className="mt-3">
            <Link href="/login">
              <Button variant="link" className="btn-block">
                Back to Login
              </Button>
            </Link>
          </div>
        </Form>
      )}
    </>
  )
}
