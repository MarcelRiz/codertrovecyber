import React, { useCallback, useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { Key as IconKey } from 'react-feather'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { login, requestOTP } from '../../states/auth'
import UserService from '../../services/UserService'
import StorageService from '../../services/StorageService'

export default function FormLoginOTP() {
  const router = useRouter()

  const { loggingIn } = useSelector(state => state.auth)
  const [userEmail, setUserEmail] = useState('')
  const [showResend, setShowResend] = useState(true)
  const dispatch = useDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm()

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */

  useEffect(() => {
    try {
      let tempLogin = StorageService.getTempLogin()
      if (!tempLogin) {
        throw new Error('Need Login')
      }
      tempLogin = JSON.parse(tempLogin)
      const { email } = tempLogin
      setUserEmail(email)
    } catch (error) {
      toast.warn('Could not find login info. Please login again!')
      router.push('/login')
    }
  }, [])

  const onResendToken = useCallback(() => {
    let tempLogin = StorageService.getTempLogin()

    if (!tempLogin) {
      toast.warn('Could not find login info. Please login again!')
      router.push('/login')
      return
    }

    tempLogin = JSON.parse(tempLogin)
    const { email, password } = tempLogin

    dispatch(requestOTP({ identifier: email, password }))
      .unwrap()
      .then(() => {
        setShowResend(false)
        setTimeout(() => {
          setShowResend(true)
        }, 30000)
      })
      .catch(error => {
        toast.warn(error.message || 'Could not log you into system.')
      })
  }, [dispatch])

  const onSubmit = useCallback(
    values => {
      let tempLogin = StorageService.getTempLogin()

      if (!tempLogin) {
        toast.warn('Could not find login info. Please login again!')
        router.push('/login')
        return
      }

      tempLogin = JSON.parse(tempLogin)
      const { email, password, remember } = tempLogin
      const { otp } = values
      dispatch(login({ identifier: email, password, otp }))
        .unwrap()
        .then(async data => {
          StorageService.removeTempLogin()
          UserService.saveSession(data, remember)
          // if (data?.user?.isFirstLogin) {
          //   dispatch(toggleChangePasswordModal(true))
          // }
          const destination = router.query?.redirectUrl?.trim()
          await router.push(`${destination || '/'}`)
        })
        .catch(error => {
          toast.warn(error.message || 'Could not log you into system.')
        })
    },
    [dispatch, router.query?.redirectUrl]
  )

  return (
    <>
      <div className="mb-5 text-center">
        <h6 className="h3 mb-1">Login verification</h6>
        <p className="text-muted mb-0">
          We just sent your authentication code via email to <i>{userEmail}.</i>
        </p>
        <Button disabled={!showResend} variant="link" onClick={onResendToken}>
          Resend the code
        </Button>
      </div>
      <span className="clearfix" />
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <Form.Label htmlFor="otp">Login verification code</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <IconKey />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Controller
              render={({ field }) => (
                <Form.Control
                  placeholder="123456"
                  {...field}
                  required
                  isInvalid={!!errors.email}
                />
              )}
              control={control}
              name="otp"
              rules={{
                required: 'Please enter your OTP',
              }}
            />
            {errors && errors.otp && (
              <Form.Control.Feedback type="invalid">
                {errors.otp.message}
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>

        <div className="mt-4">
          <Button
            type="submit"
            className="btn btn-block btn-primary btn-icon"
            disabled={loggingIn}
          >
            {loggingIn && (
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )}
            <span className="btn-inner--text">Verify</span>
          </Button>
        </div>
      </Form>
    </>
  )
}
