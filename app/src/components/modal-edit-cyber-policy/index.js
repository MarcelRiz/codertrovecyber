import React, { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import {
  closeEditCyberModal,
  getAllPolicies,
  updateCyberPolicy,
} from '../../states/policies'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function ModalEditCyberPolicy() {
  const { showEditCyberPolicy, editingCyberPolicy } = useSelector(
    state => state.policies
  )
  const dispatch = useDispatch()
  const onClose = useCallback(() => {
    dispatch(closeEditCyberModal())
  }, [dispatch])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
  } = useForm()

  useEffect(() => {
    reset({
      policyContent: editingCyberPolicy?.policyContent || '',
    })
  }, [showEditCyberPolicy, editingCyberPolicy, reset])

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const { policyContent } = values
      dispatch(
        updateCyberPolicy({
          policyId: editingCyberPolicy.id,
          policyContent,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Updated policy successfully!')
          dispatch(closeEditCyberModal())
          dispatch(getAllPolicies())
        })
        .catch(error => {
          toast.error(error.message || 'Could not update cybersecurity policy!')
        })
    },
    [dispatch, editingCyberPolicy]
  )

  return (
    <Modal show={showEditCyberPolicy} size="xl" onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Edit Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Controller
              name="policyContent"
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={value => field.onChange(value)}
                />
              )}
              control={control}
              rules={{
                required: 'Please enter content',
              }}
            />
            {errors && errors.policyContent && (
              <Form.Control.Feedback type="invalid">
                {errors.policyContent.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Button variant="primary" type="submit">
            Save changes
          </Button>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
