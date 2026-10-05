import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import makeAnimated from 'react-select/animated'
import {
  SelectStaffDropdown,
  Option,
  ValueContainer,
  MultiValue,
} from '../select-staff-dropdown'
import {
  closeUploadPolicy,
  createCompanyPolicy,
  getAllPolicies,
  getAssignedPolicies,
  updateCompanyPolicy,
} from '../../states/policies'
import { getStaffsList } from '../../states/staffs'

const animatedComponents = makeAnimated()
const allOption = {
  label: 'Select all',
  value: '*',
}

export default function ModalUploadCompanyPolicy() {
  const { showUploadPolicy, savingPolicy, editingCompanyPolicy } = useSelector(
    state => state.policies
  )
  const { staffs } = useSelector(state => state.staffs)
  const user = useSelector(state => state.auth?.session?.user)
  const [assigningStaffs, setAssigningStaffs] = useState([])
  const dispatch = useDispatch()

  /**
   * on closing upload modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(closeUploadPolicy())
  }, [dispatch])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    watch,
    reset,
  } = useForm()

  const staffListOptions = useMemo(
    () =>
      [user, ...staffs].map(staff => ({
        value: staff.id,
        label: `${staff.firstName} ${staff.lastName}(${staff.username})`,
      })),
    [staffs, user]
  )

  useEffect(() => {
    if (showUploadPolicy) {
      reset({
        name: editingCompanyPolicy?.name || '',
        owner: editingCompanyPolicy?.owner || '',
      })
      setAssigningStaffs([])
    }
  }, [editingCompanyPolicy, reset, showUploadPolicy])

  useEffect(() => {
    dispatch(getStaffsList())
  }, [dispatch])

  const file = watch('policyFile')

  /**
   * on submitting policy upload
   * @type {(function(*=): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      if (!editingCompanyPolicy) {
        // create
        const assignStaffIds = assigningStaffs
          .filter(staff => staff.value !== '*')
          .map(staff => staff.value)
        if (!assignStaffIds.length) {
          toast.warn('Please select at least one staff to assign!')
          return
        }

        dispatch(createCompanyPolicy({ ...values, assignStaffIds }))
          .unwrap()
          .then(() => {
            toast.success('Created new company policy!')
            dispatch(closeUploadPolicy())
            dispatch(getAllPolicies())
            dispatch(getAssignedPolicies())
          })
          .catch(error => {
            toast.error(error.message || 'Could not create new company policy')
          })
      } else {
        // update
        dispatch(
          updateCompanyPolicy({
            id: editingCompanyPolicy.id,
            data: values,
          })
        )
          .unwrap()
          .then(() => {
            toast.success('Updated company policy!')
            dispatch(closeUploadPolicy())
            dispatch(getAllPolicies())
          })
          .catch(error => {
            toast.error(error.message || 'Could not update company policy')
          })
      }
    },
    [assigningStaffs, dispatch, editingCompanyPolicy]
  )

  const handleChange = selected => {
    setAssigningStaffs(selected)
  }

  return (
    <Modal show={showUploadPolicy} size="xl" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editingCompanyPolicy
            ? 'Replace existing company policy'
            : 'Upload an Existing Company Policy'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="policyFile">Select file</Form.Label>
            <Controller
              name="policyFile"
              render={({ field }) => (
                <Form.File
                  custom
                  required={!editingCompanyPolicy}
                  onChange={e => field.onChange(e.target.files[0])}
                  isInvalid={!!errors.policyFile}
                  label={file?.name || 'Select a file'}
                  accept=".pdf"
                />
              )}
              control={control}
              rules={{
                required: !editingCompanyPolicy
                  ? 'Please upload a file'
                  : false,
              }}
            />
            {errors && errors.policyFile && (
              <Form.Control.Feedback type="invalid">
                {errors.policyFile.message}
              </Form.Control.Feedback>
            )}
            {editingCompanyPolicy && (
              <Form.Text>
                Current policy file:{' '}
                <a
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_API}${editingCompanyPolicy?.policyFile?.url}`}
                >
                  {editingCompanyPolicy?.policyFile?.name}
                </a>
              </Form.Text>
            )}
            <p>Select a PDF file up to 20 MB</p>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="name">What is Policy name?</Form.Label>
            <Controller
              name="name"
              render={({ field }) => (
                <Form.Control {...field} required isInvalid={!!errors.name} />
              )}
              control={control}
              rules={{ required: 'Please enter policy name' }}
            />
            {errors && errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="owner">
              Who will be the owner of this policy?
            </Form.Label>
            <Controller
              name="owner"
              render={({ field }) => (
                <Form.Control {...field} required isInvalid={!!errors.owner} />
              )}
              control={control}
              rules={{ required: 'Please enter policy owner' }}
            />
            {errors && errors.owner && (
              <Form.Control.Feedback type="invalid">
                {errors.owner.message}
              </Form.Control.Feedback>
            )}
            {!editingCompanyPolicy && (
              <>
                <Form.Label htmlFor="assigned">
                  Who will be assigned to?
                </Form.Label>
                <SelectStaffDropdown
                  options={staffListOptions}
                  isMulti
                  allOption={allOption}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  allowSelectAll
                  components={{
                    Option,
                    MultiValue,
                    ValueContainer,
                    animatedComponents,
                  }}
                  onChange={handleChange}
                  value={assigningStaffs}
                />
              </>
            )}
          </Form.Group>

          {editingCompanyPolicy && (
            <Alert variant="warning">
              Your staff are not required to acknowledge the updated version of
              this policy again if they already did.
            </Alert>
          )}

          <Button
            variant="primary"
            type="submit"
            disabled={savingPolicy}
            className="btn-icon"
          >
            {savingPolicy && (
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )}
            <span className="btn-inner--text">
              {editingCompanyPolicy ? 'Save Changes' : 'Create and assign'}
            </span>
          </Button>
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
