import { useRouter } from 'next/router'
import React, { useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { useAppSelector } from '../../../states/hooks'
import { selectUserPofile } from '../../../states/features/userProfileSlice'

export default function FormActionItem({ onCreateActionItem, onUpdateActionItem, onCancel, loading = false, data }) {
  const readOnly = true
  const { user } = useAppSelector(selectUserPofile)
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    register,
    setValue
  } = useForm()

  const onSubmit = useCallback((values) => {
    if (data) {
      onUpdateActionItem(values)
    } else {
      onCreateActionItem(values)
    }
  }, [router])

  useEffect(() => {
    setValue('name', `${user?.firstName || ''} ${user?.lastName || ''}`)
    setValue('userId', user?.id)
  }, [user])

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key])
      })
    }
  }, [data])

  return (
    <>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <Form.Label htmlFor="actionItemSummary">Action Item Summary</Form.Label>
          <InputGroup>
            <Controller
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Summary"
                  {...field}
                  isInvalid={!!errors.actionItemSummary}
                />
              )}
              control={control}
              name="actionItemSummary"
              rules={{
                required: true
              }}
            />
            {errors && errors.actionItemSummary && (
              <Form.Control.Feedback type="invalid">
                Action Item Summary is required.
              </Form.Control.Feedback>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="actionItemDetails">Action Item Details</Form.Label>
          <Form.Control as="textarea" placeholder="Details" name="actionItemDetails" {...register('actionItemDetails', { required: true })} required rows={3} />
          {errors && errors.actionItemDetails && (
            <Form.Control.Feedback type="invalid">
              Action Item Details is required.
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Label htmlFor="securityDomain">Control</Form.Label>
        <InputGroup className="mb-3">
          <Controller
            render={({ field }) => (
              <Form.Control
                type="text"
                placeholder="Control"
                {...field}
                isInvalid={!!errors.securityDomain}
              />
            )}
            control={control}
            name="securityDomain"
            rules={{
              required: false
            }}
          />
          {errors && errors.securityDomain && (
            <Form.Control.Feedback type="invalid">
              Control is required.
            </Form.Control.Feedback>
          )}
        </InputGroup>
        <Form.Label htmlFor="actionItemSummary">Control Mapping</Form.Label>
        <InputGroup className="mb-3">
          <Controller
            render={({ field }) => (
              <Form.Control
                type="text"
                placeholder="Control Mapping"
                {...field}
                isInvalid={!!errors.controlMapping}
              />
            )}
            control={control}
            name="controlMapping"
            rules={{
              required: false
            }}
          />
          {errors && errors.controlMapping && (
            <Form.Control.Feedback type="invalid">
              Control Mapping is required.
            </Form.Control.Feedback>
          )}
        </InputGroup>
        <Form.Group>
          <Form.Label htmlFor="">Action Item Source</Form.Label>
          <Form.Control name="source" placeholder="Select..." as="select" {...register('actionItemSource')}>
            <option value="checkin">Check In</option>
            <option value="report">Report</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="priority">Category</Form.Label>
          <Form.Control name="priority" placeholder="Select..." as="select" {...register('category')}>
            <option value='None'>None</option>
            <option value="Risk Profile">Risk Profile</option>
            <option value="People">People</option>
            <option value="Technology">Technology</option>
            <option value="Process">Process</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="priority">Action Item Priority</Form.Label>
          <Form.Control name="priority" placeholder="Select..." as="select" {...register('priority')}>
            <option value='high'>High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="customer">Customer</Form.Label>
          <Controller
            render={({ field }) => (
              <Form.Control
                type="text"
                placeholder=""
                {...field}
                readOnly={readOnly}
              />
            )}
            control={control}
            name="name"
          />
        </Form.Group>
        <input type="hidden" {...register('userId')} />
        <div className="text-right mt-4">
          <Button type="button" className="btn-sm" variant="secondary" disabled={loading} onClick={onCancel}>
            Close
          </Button>
          <Button type="submit" className="btn-sm" variant="primary" disabled={loading}>
            {loading && <Spinner animation="border" size="sm" />}
            {!data && 'Save'}
            {data && 'Update'}
          </Button>

        </div>
      </Form>
    </>
  )
}