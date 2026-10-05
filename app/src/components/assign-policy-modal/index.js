/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import makeAnimated from 'react-select/animated'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import PoliciesService from '@src/services/PoliciesService'
import { getAllPolicies } from '../../states/policies'
import { closeAssignPolicyModal } from '../../states/staffs'
import {
  SelectStaffDropdown as SelectPoliciesDropdown,
  Option,
  MultiValue,
  ValueContainer,
} from '../select-staff-dropdown'

const animatedComponents = makeAnimated()
const allOption = {
  label: 'Select all',
  value: '*',
}

export default function ModalAssignPolicies() {
  const [selectedPolicies, setSelectedPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const { assignPolicyModal, newCreatedStaffs } = useSelector(
    state => state.staffs
  )
  const { policies } = useSelector(state => state.policies)

  const dispatch = useDispatch()

  const {
    handleSubmit,
    formState: { isSubmitted },
  } = useForm()

  const policyOptions = useMemo(
    () =>
      policies.map(policy => ({
        value: policy.id,
        label: policy.name,
      })),
    [policies]
  )

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(async () => {
    setLoading(true)
    try {
      const formatSelectedPolicies = selectedPolicies.filter(
        policy => policy.value !== '*'
      )
      const staffs = newCreatedStaffs.filter(staff => staff?.id)
      await Promise.all(
        formatSelectedPolicies.map(policy =>
          PoliciesService.assignPolicy(
            policy.value,
            staffs.map(staff => staff.id)
          )
        )
      )
      toast.success('Assign policies successfully!')
    } catch (error) {
      toast.error('Cound not assign policies')
    }
    dispatch(closeAssignPolicyModal())
    setSelectedPolicies([])
    setLoading(false)
  }, [dispatch, selectedPolicies, newCreatedStaffs])

  /**
   * on close modal
   * @type {(function(): void)|*}
   */
  const closeModal = useCallback(() => {
    dispatch(closeAssignPolicyModal())
  }, [dispatch])

  useEffect(() => {
    dispatch(getAllPolicies())
  }, [dispatch])

  return (
    <Modal size="xl" show={assignPolicyModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Cybersecurity Policies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={isSubmitted}>
          <h5>
            <div className="d-inline-flex mr-2" style={{ width: 20 }}>
              <FontAwesomeIcon icon={faFile} className="mr-2" fixedWidth />
            </div>
            Select policies to assign
          </h5>
          <Form.Group>
            <SelectPoliciesDropdown
              options={policyOptions}
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
              onChange={selected => setSelectedPolicies(selected)}
              value={selectedPolicies}
              noOptionsMessage={() => 'No policy created yet'}
            />
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              className="btn-icon"
              disabled={loading}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {loading && (
                <span className="btn-inner--icon">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </span>
              )}
              <span className="btn-inner--text">Assign policies</span>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
