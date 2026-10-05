import React, { useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { Key as IconKey, User as IconUser } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { EMAIL_REGEX } from '../../constants'
import { requestOTP } from '../../states/auth'
import StorageService from '../../services/StorageService'

export default function FormLogin() {
  const [passwordFieldType, setPasswordFieldType] = useState('password')
  const { requestingOTP } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  /**
   * toggle password field 'type'
   * @type {(function(): void)|*}
   */
  const togglePasswordFieldType = useCallback(() => {
    setPasswordFieldType(prev => {
      if (prev === 'password') return 'text'
      return 'password'
    })
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      remember: true,
    },
  })

  const onSubmit = useCallback(
    async values => {
      const { email, password, remember } = values
      StorageService.saveTempLogin(email, password, remember)
      dispatch(requestOTP({ identifier: email, password }))
        .unwrap()
        .then(data => {
          if (data.success) {
            const destination = router.query?.redirectUrl
            const redirectUrl =
              destination && destination.length > 1
                ? `/login-otp?redirectUrl=${destination}`
                : '/login-otp'
            router.push(redirectUrl)
          } else if (
            data &&
            Array.isArray(data.message) &&
            Array.isArray(data.message[0].messages) &&
            data.message[0].messages[0] &&
            data.message[0].messages[0].message
          ) {
            toast.warn(data.message[0].messages[0].message)
          } else if (data.message) {
            toast.warn(data.message)
          } else {
            toast.warn('Could not retrieve login info.')
          }
        })
        .catch(error => {
          toast.warn(error.message || 'Could not retrieve login info.')
        })
    },
    [dispatch, router.query?.redirectUrl]
  )

  return (
    <>
      <div className="mb-5 text-center">
        <h6 className="h3 mb-1">Login</h6>
        <p className="text-muted mb-0">Sign in to your account to continue.</p>
      </div>
      <span className="clearfix" />
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
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <Form.Label htmlFor="password">Password</Form.Label>
            </div>
            <div className="mb-2">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="small text-muted text-underline--dashed border-primary"
                onClick={togglePasswordFieldType}
              >
                {passwordFieldType === 'password' ? 'Show' : 'Hide'} password
              </a>
            </div>
          </div>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text className="input-group-text">
                <IconKey />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type={passwordFieldType}
                  id="password"
                  placeholder="Password"
                  required
                  {...field}
                  isInvalid={!!errors.password}
                />
              )}
              name="password"
              control={control}
              rules={{
                required: 'Please enter your password',
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
          <div className="d-flex align-items-center justify-content-between">
            <Controller
              render={({ field }) => (
                <Form.Check
                  custom
                  id="remember"
                  type="checkbox"
                  label="Remember me"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              )}
              name="remember"
              control={control}
            />
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
        </Form.Group>

        <div className="mt-4">
          <Button
            type="submit"
            className="btn btn-block btn-primary btn-icon"
            disabled={requestingOTP}
          >
            {requestingOTP && (
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )}
            <span className="btn-inner--text">Continue</span>
          </Button>
        </div>
      </Form>
    </>
  )
}
