import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge, Card, Col, Dropdown, ProgressBar } from 'react-bootstrap'
import { MoreHorizontal } from 'react-feather'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'
import ModalAssignStaffToPolicy from '../modal-assign-policy-staff'
import { POLICY_ACKNOWLEDGE_BADGE, POLICY_TYPE } from '../../constants'
import PoliciesService from '../../services/PoliciesService'
import {
  getAllPolicies,
  getAssignedPolicies,
  setAssigningCompanyPolicy,
} from '../../states/policies'
import download from '../../utilities/download'
import { openAssignStaffToPolicyModal } from '../../states/staffs'

export default function Policy({ policy, onEdit, isEditing = false }) {
  const router = useRouter()
  const { user } = useSelector(state => state.auth?.session)
  const { assignedPolicies } = useSelector(state => state.policies)
  const [acknowledgedNumber, setAcknowledgedNumber] = useState(0)
  const dispatch = useDispatch()
  const [policyAssignedUsers, setPolicyAssignedUsers] = useState([])

  /**
   * export policy
   * @type {(function(): void)|*}
   */
  const exportPolicy = useCallback(() => {
    toast.info(`Downloading policy "${policy.name}"...`)
    if (policy.pdfFile) {
      download(
        `${process.env.NEXT_PUBLIC_API}${policy.policyFile.url}`,
        policy.policyFile.name
      )
    } else {
      PoliciesService.downloadPolicy(policy.id).then(pdf => {
        download(pdf, `${policy.name}.pdf`)
      })
    }
  }, [policy])

  /**
   * count number of acknowledged policies
   * @type {(function(): void)|*}
   */
  const countPolicyAcknowledgement = useCallback(() => {
    if (!policy) return
    PoliciesService.countPolicyAcknowledged(policy.id, user?.id).then(
      response => {
        setAcknowledgedNumber(response.data)
      }
    )
  }, [policy, user?.id])

  /**
   * on load, get number of acknowledged policies
   */
  useEffect(() => {
    if (isEditing) {
      countPolicyAcknowledgement()
    }
  }, [countPolicyAcknowledgement, isEditing])

  useEffect(() => {
    PoliciesService.getAssignedPolicyById(undefined, policy.id).then(
      response => {
        setPolicyAssignedUsers(response.data.map(item => item.user))
      }
    )
  }, [policy])

  /**
   * calculate percentage of acknowledged
   * @type {unknown}
   */
  const acknowledgePercent = useMemo(
    () =>
      (policyAssignedUsers.length === 0
        ? 0
        : (acknowledgedNumber * 100) / policyAssignedUsers.length
      ).toFixed(1),
    [acknowledgedNumber, policyAssignedUsers.length]
  )

  /**
   * delete policy
   * @type {(function(): void)|*}
   */
  const deletePolicy = useCallback(() => {
    Swal.fire({
      icon: 'question',
      title: 'Are you sure you want to delete this policy?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      preConfirm() {
        return PoliciesService.deletePolicy(policy.id)
          .then(result => Promise.resolve(result))
          .catch(error => {
            toast.error(error.message || 'Could not delete policy!')
            return Promise.reject(error)
          })
      },
    }).then(result => {
      if (result.isConfirmed) {
        toast.success('Deleted policy successfully!')
        dispatch(getAllPolicies())
        dispatch(getAssignedPolicies())
      }
    })
  }, [dispatch, policy])

  /**
   * push user to page acknowledge
   * @type {(function(): void)|*}
   */
  const goToAcknowledge = useCallback(() => {
    // dispatch(openAcknowledgePolicy(policy))
    router.push(`/cyber-governance-centre/${policy?.id}`)
  }, [policy?.id, router])

  /**
   * get acknowledgement status
   * @type {unknown}
   */
  const acknowledgeStatus = useMemo(() => {
    const find = assignedPolicies.find(
      item => item?.companyPolicy?.id === policy?.id
    )
    if (find && find.isAcknowledged)
      return POLICY_ACKNOWLEDGE_BADGE.ACKNOWLEDGED
    return POLICY_ACKNOWLEDGE_BADGE.PENDING
  }, [assignedPolicies, policy])

  /**
   * assign policy
   * @type {(function(): void)|*}
   */
  const assignPolicy = useCallback(() => {
    dispatch(openAssignStaffToPolicyModal())
    dispatch(setAssigningCompanyPolicy(policy))
  }, [dispatch, policy])

  /**
   * check if policy type is Cyber
   * @type {boolean}
   */
  const isCyberPolicy = useMemo(
    () => policy?.type === POLICY_TYPE.CYBER,
    [policy]
  )

  /**
   * check policy status is pending
   * @type {boolean}
   */
  const isPending = useMemo(
    () => acknowledgeStatus === POLICY_ACKNOWLEDGE_BADGE.PENDING,
    [acknowledgeStatus]
  )

  /**
   * display date of policy
   * @type {string}
   */
  const displayedDate = useMemo(
    () => moment(policy?.publishedDate).format('DD MMMM, YYYY'),
    [policy]
  )

  return (
    <>
      <Card
        className="mb-3 hover-shadow-lg"
        style={{
          cursor: !isEditing ? 'pointer' : 'auto',
        }}
        onClick={() => {
          if (!isEditing) {
            goToAcknowledge()
          }
        }}
      >
        <Card.Body className="d-flex align-items-start align-items-lg-center flex-wrap flex-lg-nowrap px-2 py-3">
          <Col xs={10} lg={5}>
            {isEditing && isCyberPolicy && (
              <>
                <Badge
                  variant={policy.isLive ? 'success' : 'light'}
                  className="mb-1 d-inline-block"
                >
                  {policy.isLive ? 'Assigned' : 'Unassigned'}
                </Badge>
                <br />
              </>
            )}
            {!isEditing && (
              <>
                <Badge variant={isPending ? 'warning' : 'success'}>
                  {acknowledgeStatus}
                </Badge>
                <br />
              </>
            )}
            <strong>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <div>{policy?.name}</div>
            </strong>
            {policy?.isLive && isEditing && (
              <>
                <br />
                <span className="text-sm text-muted">Acknowledged</span>
                <ProgressBar
                  style={{ height: 16 }}
                  variant="success"
                  now={acknowledgePercent}
                  label={`${acknowledgePercent}%`}
                />
              </>
            )}
          </Col>
          <Col xs={2} lg={1} className="text-right order-lg-5">
            {isEditing && (
              <Dropdown className="action-item p-0">
                <Dropdown.Toggle
                  as="a"
                  className={`action-item ${styles['action-btn']}`}
                >
                  <MoreHorizontal />
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight>
                  {!policy?.isLive && policy?.type === POLICY_TYPE.CYBER && (
                    <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
                  )}
                  {policy?.type === POLICY_TYPE.COMPANY && (
                    <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={exportPolicy}>Export</Dropdown.Item>
                  {policy?.type === POLICY_TYPE.CYBER && (
                    <Dropdown.Item onClick={assignPolicy}>Assign</Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={deletePolicy} className="text-danger">
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {!isEditing && isPending && (
              <Dropdown
                className="action-item p-0"
                onToggle={(_, event) => {
                  event.stopPropagation()
                }}
              >
                <Dropdown.Toggle
                  as="a"
                  className={`action-item ${styles['action-btn']}`}
                >
                  <MoreHorizontal />
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight>
                  <Dropdown.Item onClick={goToAcknowledge}>
                    Read and Acknowledgement
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Col>
          <Col xs={6} lg={3} className="pt-2 pt-lg-0">
            <span className="text-muted text-sm">Published date:</span>
            <br />
            <b>{displayedDate}</b>
          </Col>
          <Col xs={6} lg={3} className="pt-2 pt-lg-0">
            <span className="text-muted text-sm">Policy Owner:</span>
            <br />
            <b>{policy?.owner}</b>
          </Col>
        </Card.Body>
      </Card>
      <ModalAssignStaffToPolicy />
    </>
  )
}
