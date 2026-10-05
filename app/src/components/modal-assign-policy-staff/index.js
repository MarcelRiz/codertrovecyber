import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector, batch } from 'react-redux'

import { toast } from 'react-toastify'
import makeAnimated from 'react-select/animated'
import {
  closeAssignStaffToPolicyModal,
  getStaffsList,
} from '../../states/staffs'
import PoliciesService from '../../services/PoliciesService'
import {
  getAllPolicies,
  getAssignedPolicies,
  setAssigningCompanyPolicy,
} from '../../states/policies'
import {
  SelectStaffDropdown,
  Option,
  ValueContainer,
  MultiValue,
} from '../select-staff-dropdown'

const animatedComponents = makeAnimated()
const allOption = {
  label: 'Select all',
  value: '*',
}

export default function ModalAssignStaffToPolicy() {
  const { staffs, showAssignStaffToPolicyModal } = useSelector(
    state => state.staffs
  )
  const { assigningCompanyPolicy, assigningCompanyPolicies } = useSelector(
    state => state.policies
  )
  const {
    session: { user },
    companySummary: { overall: companyStaffs },
  } = useSelector(state => state.auth)

  const [policyAssignedUsers, setPolicyAssignedUsers] = useState([])
  const [assigningStaffs, setAssigningStaffs] = useState([])

  const dispatch = useDispatch()

  const {
    formState: { isSubmitted },
    handleSubmit,
    reset,
  } = useForm()

  const modalStaffList = useMemo(() => {
    if (assigningCompanyPolicies?.length)
      return companyStaffs.map(staff => ({
        value: staff.userId,
        label: `${staff.firstName} ${staff.lastName}(${staff.username})`,
      }))
    if (!companyStaffs) return []
    const policyAssignedUserIdsHash = policyAssignedUsers.reduce((acc, cur) => {
      acc[cur.id] = true
      return acc
    }, {})
    return companyStaffs
      .filter(item => !policyAssignedUserIdsHash[item.userId])
      .map(staff => ({
        value: staff.userId,
        label: `${staff.firstName} ${staff.lastName}(${staff.username})`,
      }))
  }, [
    policyAssignedUsers,
    staffs,
    user,
    companyStaffs,
    assigningCompanyPolicies,
  ])

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */
  const onAssignStaffs = useCallback(async () => {
    const staffIds = assigningStaffs
      .filter(staff => staff.value !== '*')
      .map(staff => staff.value)

    if (!staffIds.length) {
      toast.warn('Please select at least one staff to assign')
      return
    }

    Swal.fire({
      icon: 'question',
      title: 'Assigning policy',
      text: 'Are you sure you want to assign this policy? Once this policy is assigned, you can not edit it anymore',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      preConfirm() {
        return new Promise((resolve, reject) => {
          if (assigningCompanyPolicy) {
            PoliciesService.assignPolicy(assigningCompanyPolicy?.id, staffIds)
              .then(results => {
                resolve(results)
                toast.success('Assigned policy successfully!')
              })
              .catch(errors => {
                reject(errors)
                toast.warn('Could not assign policies')
              })
          } else {
            PoliciesService.bulkAssignPolicies(
              staffIds,
              assigningCompanyPolicies
            )
              .then(results => {
                resolve(results)
                toast.success('Assigned policies successfully!')
              })
              .catch(errors => {
                reject(errors)
                toast.warn('Could not assign policies')
              })
          }
        })
      },
    }).then(result => {
      if (result.isConfirmed) {
        batch(() => {
          dispatch(getAllPolicies())
          dispatch(closeAssignStaffToPolicyModal())
          dispatch(getAssignedPolicies())
          dispatch(setAssigningCompanyPolicy(null))
        })
      }
    })
  }, [
    assigningCompanyPolicy?.id,
    assigningStaffs,
    dispatch,
    assigningCompanyPolicies,
  ])

  /**
   * on close modal
   * @type {(function(): void)|*}
   */
  const closeModal = useCallback(() => {
    dispatch(closeAssignStaffToPolicyModal())
  }, [dispatch])

  /**
   * get all company staffs
   * @type {(function(): void)|*}
   */
  const getStaffs = useCallback(() => {
    dispatch(getStaffsList())
  }, [dispatch])

  /**
   * on opening get all staffs
   */
  useEffect(() => {
    if (showAssignStaffToPolicyModal) {
      getStaffs()
    }
  }, [showAssignStaffToPolicyModal, getStaffs])

  useEffect(() => {
    if (showAssignStaffToPolicyModal) {
      reset({
        staffs: [],
      })
      setAssigningStaffs([])
    }
  }, [reset, showAssignStaffToPolicyModal])

  useEffect(() => {
    if (!assigningCompanyPolicy?.id) return
    ;(async () => {
      const response = await PoliciesService.getAssignedPolicyById(
        undefined,
        assigningCompanyPolicy.id
      )
      const users = response.data.map(item => item.user)
      setPolicyAssignedUsers(users)
    })()
  }, [assigningCompanyPolicy])

  const handleChange = selected => {
    setAssigningStaffs(selected)
  }

  return (
    <Modal size="xl" show={showAssignStaffToPolicyModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={isSubmitted}
          onSubmit={handleSubmit(onAssignStaffs)}
        >
          <h5>
            <div className="d-inline-flex mr-2" style={{ width: 20 }}>
              <FontAwesomeIcon icon={faFile} className="mr-2" fixedWidth />
            </div>
            Select staffs to assign{' '}
            {assigningCompanyPolicy ? 'the policy' : 'these policies'}
          </h5>
          <Form.Group>
            <SelectStaffDropdown
              options={modalStaffList}
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
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" className="btn-icon" type="submit">
              <span className="btn-inner--text">Assign</span>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
