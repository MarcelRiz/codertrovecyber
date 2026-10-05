/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {
  importStaff,
  closeAddModal,
  getStaffsList,
  openAssignPolicyModal,
  closeAssignPolicyModal,
} from '../../states/staffs'
import ModalDepartmentMapping from '../modal-department-mapping'

export default function FormUploadStaffsCsv() {
  const [modalDepartmentMappingVisible, setModalDepartmentMappingVisible] =
    useState(false)
  const { importingStaff } = useSelector(state => state.staffs)
  const dispatch = useDispatch()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    watch,
  } = useForm()

  const watchFile = watch('file')

  /**
   * on submitting form
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const { file } = values
      dispatch(importStaff(file))
        .unwrap()
        .then(data => {
          toast.success('Imported staffs successfully!')
          dispatch(getStaffsList())
          dispatch(closeAddModal())
          Swal.fire({
            icon: 'question',
            title: 'Would you like to assign policies to these staffs?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            preConfirm() {
              dispatch(openAssignPolicyModal({ users: data }))
            },
          }).then(result => {
            if (result.isDismissed) {
              dispatch(closeAssignPolicyModal())
            }
          })
        }, [])
        .catch(error => {
          toast.warn(error.message || 'Could not import staffs')
        })
    },
    [dispatch]
  )

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} validated={isSubmitted}>
      <p>
        You can also upload a list of users, using{' '}
        <a href="/staffs-template.csv" target="_blank">
          this template
        </a>
        .
      </p>
      <p>
        Click{' '}
        <a
          className="here"
          onClick={() => setModalDepartmentMappingVisible(true)}
        >
          here
        </a>{' '}
        to view the department ID mapping.
      </p>

      <ModalDepartmentMapping
        visible={modalDepartmentMappingVisible}
        setVisible={setModalDepartmentMappingVisible}
      />
      <Form.Group>
        <Form.Label>Upload your CSV file</Form.Label>
        <Controller
          render={({ field }) => (
            <Form.File
              custom
              label={watchFile ? watchFile.name : 'Select your CSV file'}
              isInvalid={!!errors.file}
              required
              onChange={e => field.onChange(e.target.files[0])}
            />
          )}
          name="file"
          rules={{ required: 'Please select a file' }}
          control={control}
        />
        {errors && errors.file && (
          <Form.Control.Feedback type="invalid">
            {errors.file.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        disabled={importingStaff}
        className="btn-icon"
      >
        {importingStaff && (
          <span className="btn-inner--icon">
            <FontAwesomeIcon icon={faSpinner} spin />
          </span>
        )}
        <span className="btn-inner--text">Add company staff in bulk</span>
      </Button>
    </Form>
  )
}
