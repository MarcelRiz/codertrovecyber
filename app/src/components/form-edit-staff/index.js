import React, { useCallback, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { EMAIL_REGEX } from '../../constants'
import {
  closeAddModal,
  closeAssignPolicyModal,
  getStaffsList,
  openAssignPolicyModal,
  registerStaff,
  updateStaff,
} from '../../states/staffs'
import { setFetchMeTime, getDepartment } from '../../states/auth'

const {
  Group: FormGroup,
  Label: FormLabel,
  Control: FormControl,
  Control: { Feedback: FormFeedback },
} = Form
export default function FormEditStaff({ onComplete = () => {} }) {
  const { submittingStaff, editingStaff } = useSelector(state => state.staffs)
  const { departments } = useSelector(state => state.auth)

  const dispatch = useDispatch()

  /**
   * callback to refresh staffs list after some specific task
   * @type {(function(): void)|*}
   */
  const reloadStaffs = useCallback(() => {
    dispatch(getStaffsList())
  }, [dispatch])

  useEffect(() => {
    dispatch(getDepartment())
  }, [])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
  } = useForm()

  useEffect(() => {
    reset({
      firstName: editingStaff?.firstName || '',
      lastName: editingStaff?.lastName || '',
      email: editingStaff?.email || '',
      phone: editingStaff?.phone || '',
      departmentId: editingStaff?.departmentId?.id || '',
    })
  }, [editingStaff, reset])

  /**
   * on submitting staff info
   * @type {(function(*=): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const modifyValue = { ...values }
      if (modifyValue.departmentId.value) {
        modifyValue.departmentId = modifyValue.departmentId.value
      }

      if (!editingStaff) {
        // create
        dispatch(registerStaff(modifyValue))
          .unwrap()
          .then(data => {
            toast.success('New staff added!')
            dispatch(setFetchMeTime())
            reloadStaffs()
            onComplete()
            dispatch(closeAddModal())
            Swal.fire({
              icon: 'question',
              title: 'Would you like to assign policies to this staff?',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              preConfirm() {
                dispatch(openAssignPolicyModal({ users: [data.user] }))
              },
            }).then(result => {
              if (result.isDismissed) {
                dispatch(closeAssignPolicyModal())
              }
            })
          })
          .catch(error => {
            toast.error(error.message || 'Could not register new staff!')
          })
      } else {
        // edit
        dispatch(updateStaff({ id: editingStaff.id, data: modifyValue }))
          .unwrap()
          .then(() => {
            toast.success('Staff was updated!')
            dispatch(setFetchMeTime())
            reloadStaffs()
            onComplete()
          })
          .catch(error => {
            toast.error(error.message || 'Could not update staff!')
          })
      }
    },
    [dispatch, editingStaff, onComplete, reloadStaffs]
  )

  const departmentOptions = useMemo(
    () =>
      departments.reduce((acc, curr) => {
        acc.push({
          label: curr.name,
          value: curr.id,
        })
        return acc
      }, []),
    [departments]
  )

  const getSelectLabel = useCallback(
    value => {
      if (value?.label && value?.value) {
        return value
      }
      const selected = departmentOptions.find(
        department => department.value === value
      )
      return {
        label: selected?.label,
        value: selected?.value,
      }
    },
    [departmentOptions]
  )

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} validated={isSubmitted}>
      <FormGroup>
        <FormLabel htmlFor="firstName">First Name</FormLabel>
        <Controller
          render={({ field }) => (
            <FormControl
              required
              {...field}
              isInvalid={!!errors.firstName}
              placeholder="Enter staff first name"
            />
          )}
          name="firstName"
          control={control}
          rules={{
            required: 'Please enter first name',
          }}
        />
        {errors && errors.firstName && (
          <FormFeedback type="invalid">{errors.firstName.message}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="lastName">Last Name</FormLabel>
        <Controller
          render={({ field }) => (
            <FormControl
              required
              {...field}
              isInvalid={!!errors.lastName}
              placeholder="Enter staff last name"
            />
          )}
          name="lastName"
          control={control}
          rules={{
            required: 'Please enter last name',
          }}
        />
        {errors && errors.lastName && (
          <FormFeedback type="invalid">{errors.lastName.message}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Controller
          render={({ field }) => (
            <FormControl
              required
              type="email"
              {...field}
              isInvalid={!!errors.email}
              placeholder="Enter staff email"
            />
          )}
          name="email"
          control={control}
          rules={{
            required: 'Please enter email',
            pattern: {
              value: EMAIL_REGEX,
              message: 'Please enter a valid email address',
            },
          }}
        />
        {errors && errors.email && (
          <FormFeedback type="invalid">{errors.email.message}</FormFeedback>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabel htmlFor="phone">Mobile phone</FormLabel>
        <Controller
          render={({ field }) => (
            <FormControl
              type="tel"
              {...field}
              isInvalid={!!errors.phone}
              placeholder="Enter staff phone number"
              pattern="^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$"
            />
          )}
          name="phone"
          control={control}
          rules={{
            pattern: {
              value:
                /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
              message: 'Please enter a valid phone number',
            },
          }}
        />
        {errors && errors.phone && (
          <FormFeedback type="invalid">{errors.phone.message}</FormFeedback>
        )}
      </FormGroup>

      <FormGroup className="d-flex flex-column">
        <FormLabel htmlFor="departmentId">Department</FormLabel>
        <Controller
          render={({ field }) => (
            <Select
              options={departmentOptions}
              placeholder="Select department"
              isClearable
              {...field}
              value={getSelectLabel(field.value)}
            />
          )}
          name="departmentId"
          control={control}
          rules={{
            required: 'Please select department',
          }}
        />
        {errors && errors.departmentId && (
          <FormFeedback type="invalid" className="d-block">
            {errors.departmentId.message}
          </FormFeedback>
        )}
      </FormGroup>

      <Button
        variant="primary"
        type="submit"
        disabled={submittingStaff}
        className="btn-icon"
      >
        {submittingStaff && (
          <span className="btn-inner--icon">
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          </span>
        )}
        <span className="btn-inner--text">Save changes</span>
      </Button>
    </Form>
  )
}
