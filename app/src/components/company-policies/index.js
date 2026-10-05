import React, { useCallback, useMemo, memo } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { MoreHorizontal } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import Fuse from 'fuse.js'
import moment from 'moment'
import JSzip from 'jszip'
import styles from '../policy/styles.module.scss'
import ModalUploadCompanyPolicy from '../modal-upload-company-policy'
import {
  getAllPolicies,
  getAssignedPolicies,
  openUploadPolicy,
} from '../../states/policies'
import { POLICY_TYPE } from '../../constants'
import PoliciesService from '../../services/PoliciesService'
import { downloadBlob } from '../../utilities/download'
import PoliciesTable from '../policies-table'

function CompanyPolicies({ isEditing = false }) {
  const { search, assignedPolicies } = useSelector(state => state.policies)
  const policies = useSelector(state =>
    state.policies.policies
      .filter(item => item.type === POLICY_TYPE.COMPANY)
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
    const fuse = new Fuse(policies, {
      keys: ['name', 'owner'],
    })
    return fuse.search(search).map(item => item.item)
  }, [isEditing, policies, search, userAssignedPoliciesHash])
  const dispatch = useDispatch()

  /**
   * on opening upload modal, for adding
   * @type {(function(): void)|*}
   */
  const openAdd = useCallback(() => {
    dispatch(openUploadPolicy(null))
  }, [dispatch])

  /**
   * export all policies
   * @type {(function(): void)|*}
   */
  const exportAll = useCallback(() => {
    // policies.forEach(policy => {
    //   download(
    //     `${process.env.NEXT_PUBLIC_API}${policy.policyFile.url}`,
    //     policy.policyFile.name
    //   )
    // })
    toast.info('Downloading files, please wait...')
    const promises = policies.map(async item => {
      const url = `${process.env.NEXT_PUBLIC_API}${item.policyFile.url.slice(
        1
      )}`
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
        downloadBlob(content, 'company-policies.zip')
      })
    })
  }, [policies])

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

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h3>Company Policies</h3>
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
              <Dropdown.Item className="text-danger" onClick={deleteAll}>
                Delete all
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      {isEditing && (
        <div className="text-center mb-3">
          <Button variant="primary" className="rounded-pill" onClick={openAdd}>
            Upload Existing Policy
          </Button>
        </div>
      )}
      <PoliciesTable
        policies={filteredPolicies}
        isEditing={isEditing}
        policyType={POLICY_TYPE.COMPANY}
      />

      <ModalUploadCompanyPolicy />
    </>
  )
}

const MemmoizedCompanyPolicies = memo(CompanyPolicies)
export default MemmoizedCompanyPolicies
