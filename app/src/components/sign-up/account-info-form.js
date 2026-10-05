import React, { useState, useCallback, useEffect } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import {
  Key as IconKey,
  User as IconUser,
  Type as IconName,
} from 'react-feather'
import { EMAIL_REGEX, PASSWORD_REGEX } from '@src/constants'
import StorageService from '@src/services/StorageService'
import PasswordStrengthCheck from '../password-strength-check'

export default function UserInfoForm({ nextFormStep, defaultValues }) {
  const [passwordFieldType, setPasswordFieldType] = useState('password')
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
    reset,
    watch,
  } = useForm({
    defaultValues,
  })

  const watchPassword = watch('password')
  const onSubmit = values => {
    const cached = StorageService.getSignUpInfo()
    StorageService.setSignUpInfo({
      ...cached,
      ...values,
    })
    nextFormStep()
  }

  useEffect(() => {
    const cached = StorageService.getSignUpInfo()
    reset({
      firstName: cached?.firstName || defaultValues?.firstName,
      lastName: cached?.lastName || defaultValues?.lastName,
      email: cached?.email || defaultValues?.email,
      password: cached?.password || defaultValues?.password,
    })
  }, [reset, defaultValues])

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} validated={isSubmitted}>
      <Form.Group>
        <Form.Label htmlFor="firstName">First Name</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <IconName />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Controller
            render={({ field }) => (
              <Form.Control
                placeholder="Enter your first name"
                {...field}
                required
                isInvalid={!!errors.firstName}
              />
            )}
            control={control}
            name="firstName"
            rules={{
              required: 'Please enter your first name',
            }}
          />
          {errors && errors.firstName && (
            <Form.Control.Feedback type="invalid">
              {errors.firstName.message}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="lastName">Last Name</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <IconName />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Controller
            render={({ field }) => (
              <Form.Control
                placeholder="Enter your last name"
                {...field}
                required
                isInvalid={!!errors.lastName}
              />
            )}
            control={control}
            name="lastName"
            rules={{
              required: 'Please enter your last name',
            }}
          />
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
      <PasswordStrengthCheck password={watchPassword} show={!!watchPassword} />
      <Button type="submit" className="btn btn-block btn-primary btn-icon">
        <span className="btn-inner--text">Continue</span>
      </Button>{' '}
    </Form>
  )
}
