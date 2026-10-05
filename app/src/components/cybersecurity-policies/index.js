import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { MoreHorizontal } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import Fuse from 'fuse.js'
import moment from 'moment'
import JSzip from 'jszip'
import { getCompanySummary } from '../../states/auth'
import styles from '../policy/styles.module.scss'
import ModalGeneratePolicies from '../modal-generate-policies'
import {
  getAllPolicies,
  getAssignedPolicies,
  openGenerateModal,
} from '../../states/policies'
import ModalEditCyberPolicy from '../modal-edit-cyber-policy'
import { POLICY_TYPE } from '../../constants'
import PoliciesService from '../../services/PoliciesService'
import { downloadBlob } from '../../utilities/download'
import { getStaffsList } from '../../states/staffs'
import PoliciesTable from '../policies-table'
import ModalAssignStaffToPolicy from '../modal-assign-policy-staff'

function CybersecurityPolicies({ isEditing = false }) {
  const { search, assignedPolicies } = useSelector(state => state.policies)
  const { staffs } = useSelector(state => state.staffs)
  const companyStaffs = useSelector(
    state => state.auth?.companySummary?.overall || []
  )
  const dispatch = useDispatch()

  /**
   * query policies
   * @type {T[]}
   */
  const policies = useSelector(state =>
    state.policies.policies
      .filter(item => item.type === POLICY_TYPE.CYBER)
      .sort((a, b) => {
        const dayA = moment(a.publishedDate)
        const dayB = moment(b.publishedDate)

        return dayB.diff(dayA)
      })
  )

  const userAssignedPoliciesHash = useMemo(
    () =>
      assignedPolicies.reduce((acc, cur) => {
        acc[cur.companyPolicy.id] = true
        return acc
      }, {}),
    [assignedPolicies]
  )

  useEffect(() => {
    dispatch(getCompanySummary())
  }, [dispatch])

  /**
   * policies with fuzzy search applied
   * @type {*[]}
   */
  const filteredPolicies = useMemo(() => {
    const cloned = policies.filter(item => {
      if (isEditing) return true
      return userAssignedPoliciesHash[item.id]
    })

    if (!search) return cloned
    const fuse = new Fuse(cloned, {
      keys: ['name', 'policyTemplate.description', 'owner'],
    })
    return fuse.search(search).map(item => item.item)
  }, [isEditing, policies, search, userAssignedPoliciesHash])

  /**
   * on opening modal generate policies
   * @type {(function(): void)|*}
   */
  const openModalGenerate = useCallback(() => {
    dispatch(openGenerateModal())
  }, [dispatch])

  /**
   * delete all policies
   * @type {(function(): void)|*}
   */
  const deleteAll = useCallback(() => {
    Swal.fire({
      icon: 'question',
      title: 'Delete policies',
      text: `Are you sure you want to delete ${policies.length} policies?`,
      showCancelButton: true,
      confirmButtonText: 'Delete all',
      preConfirm() {
        return new Promise((resolve, reject) => {
          const promises = policies.map(({ id }) =>
            PoliciesService.deletePolicy(id)
          )
          Promise.all(promises)
            .then(results => {
              resolve(results)
              toast.success('Deleted all policies!')
            })
            .catch(errors => {
              reject(errors)
              toast.warn('Could not delete policies.')
            })
        })
      },
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(getAllPolicies())
        dispatch(getAssignedPolicies())
      }
    })
  }, [dispatch, policies])

  /**
   * assign all policies
   * @type {(function(): void)|*}
   */
  const assignAll = useCallback(() => {
    dispatch(getStaffsList())
    Swal.fire({
      icon: 'question',
      title: 'Assigning policy',
      text: 'Are you sure you want to assign all policies to all staff?',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      async preConfirm() {
        const formatPolicies = await Promise.all(
          policies.map(async item => {
            const cloned = { ...item }
            let assignedStaffs = await PoliciesService.getAssignedPolicyById(
              undefined,
              item.id
            )
            assignedStaffs = assignedStaffs.data
            let unassignedStaffIds = companyStaffs.filter(
              staff =>
                !assignedStaffs.find(
                  assignedStaff => assignedStaff.user.id === staff.userId
                )
            )
            unassignedStaffIds = unassignedStaffIds.map(staff => staff.userId)
            cloned.unassignedStaffIds = unassignedStaffIds
            return cloned
          })
        )

        const assignAllPoliciesPromises = formatPolicies.map(item =>
          PoliciesService.assignPolicy(item.id, item.unassignedStaffIds)
        )
        return new Promise((resolve, reject) => {
          Promise.all(assignAllPoliciesPromises)
            .then(results => {
              resolve(results)
              toast.success('Assigned all policies successfully!')
            })
            .catch(errors => {
              reject(errors)
              toast.warn('Could not assign policies')
            })
        })
      },
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(getAllPolicies())
      }
    })
  }, [dispatch, policies, staffs])

  /**
   * export all policies
   * @type {(function(): void)|*}
   */
  const exportAll = useCallback(() => {
    // policies.forEach(item => {
    //   PoliciesService.downloadPolicy(item.id).then(pdf => {
    //     download(pdf, `${item.name}.pdf`)
    //   })
    // })
    toast.info('Downloading files, please wait...')
    const promises = policies.map(async item => {
      const url = await PoliciesService.downloadPolicy(item.id)
      const t = await fetch(url)
      const b = await t.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = error => {
          reject(error)
        }
        reader.readAsBinaryString(b)
      })
    })
    Promise.all(promises).then(pdfs => {
      toast.info('Compressing, please wait...')
      const zip = new JSzip()
      pdfs.forEach((pdf, index) => {
        zip.file(`${policies[index].name}.pdf`, pdf, { binary: true })
      })
      zip.generateAsync({ type: 'blob' }).then(content => {
        downloadBlob(content, 'cybersecurity-policies.zip')
      })
    })
  }, [policies])

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Cybersecurity Policies</h3>
        {policies.length > 0 && isEditing && (
          <Dropdown className="action-item">
            <Dropdown.Toggle
              as="a"
              className={`action-item ${styles['action-btn']}`}
            >
              <MoreHorizontal />
            </Dropdown.Toggle>

            <Dropdown.Menu alignRight>
              <Dropdown.Item onClick={exportAll}>Export all</Dropdown.Item>
              <Dropdown.Item onClick={assignAll}>Assign all</Dropdown.Item>
              <Dropdown.Item className="text-danger" onClick={deleteAll}>
                Delete all
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {isEditing && (
        <div className="text-center mb-3">
          <Button
            id="generate_policy_set"
            variant="primary"
            className="rounded-pill"
            onClick={openModalGenerate}
          >
            Generate new security policy set
          </Button>
        </div>
      )}
      <PoliciesTable
        policies={filteredPolicies}
        isEditing={isEditing}
        policyType={POLICY_TYPE.CYBER}
      />

      <ModalAssignStaffToPolicy />

      <ModalGeneratePolicies />

      <ModalEditCyberPolicy />
    </>
  )
}

const MemmoizedCybersecurityPolicies = memo(CybersecurityPolicies)
export default MemmoizedCybersecurityPolicies
