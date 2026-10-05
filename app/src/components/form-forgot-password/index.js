import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { User as IconUser } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { forgotPassword, resetForgotPasswordStep } from '../../states/auth'
import { EMAIL_REGEX } from '../../constants'

export default function FormForgotPassword() {
  const { submittingForgotPassword, forgotPasswordStep } = useSelector(
    state => state.auth
  )
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  /**
   * on load, set step to first step
   */
  useEffect(() => {
    dispatch(resetForgotPasswordStep())
  }, [dispatch])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm()

  /**
   * on submitting forgot password info
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const { email } = values
      dispatch(forgotPassword(email))
        .unwrap()
        .then(response => {
          setMessage(response.message)
        })
        .catch(error => {
          toast.warn(error.message || 'Could not send your submission')
        })
    },
    [dispatch]
  )

  return (
    <>
      <div className="mb-5 text-center">
        <h6 className="h3 mb-1">Forgot your password</h6>
        <p className="text-muted mb-0">
          Enter your email to receive reset password instruction.
        </p>
      </div>
      <span className="clearfix" />
      {forgotPasswordStep === 1 && (
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
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
                    required
                    {...field}
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

          <div className="mt-4">
            <Button
              type="submit"
              className="btn btn-block btn-primary btn-icon"
              disabled={submittingForgotPassword}
            >
              {submittingForgotPassword && (
                <span className="btn-inner--icon">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </span>
              )}
              <span className="btn-inner--text">Send</span>
            </Button>
          </div>
        </Form>
      )}

      {forgotPasswordStep === 2 && (
        <div>
          <p>{message}</p>
        </div>
      )}

      <div className="text-center mt-3">
        <Link href="/login">Back to Login</Link>
      </div>
    </>
  )
}
