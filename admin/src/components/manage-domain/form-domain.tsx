import React, { useEffect, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { URL_REGEX } from '@src/constants'

export default function FormDomain({
  onSubmitDomain,
  onCancel,
  data,
  loading,
}) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    setValue,
    reset,
  } = useForm()

  useEffect(() => {
    reset({
      domain: '',
    })
  }, [])

  useEffect(() => {
    if (data) {
      setValue('domain', data.domain)
    }
  }, [data])

  const onSubmit = useCallback(
    values => {
      onSubmitDomain({
        ...values,
        id: data.id,
      })
    },
    [data]
  )

  return (
    <>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <Form.Label htmlFor="domain">Domain</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Domain"
                  {...field}
                  isInvalid={!!errors.domain}
                />
              )}
              control={control}
              name="domain"
              rules={{
                required: 'Please enter domain or subdomain',
                pattern: {
                  value: URL_REGEX,
                  message: 'Please enter a valid domain or subdomain',
                },
              }}
            />
            {errors && errors.domain && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.domain.message}
              </Form.Control.Feedback>
            )}
          </InputGroup>
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
              {loading && (
                <Spinner animation="border" size="sm" className="mr-2" />
              )}
              Confirm
            </Button>
          </div>
        </div>
      </Form>
    </>
  )
}
