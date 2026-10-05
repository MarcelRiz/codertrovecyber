import React, { useEffect, useState, useCallback } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { get } from 'lodash'
import {
  deletedUser,
  getStaffUsers,
  selectCompanyStaff,
  setErrorMessage,
  setUsers,
  updatedUser,
  updateUserRole,
} from '../../../states/features/companyStaffSlice'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import { PaginationOwn } from '../../shared'
import useSortableData from '../../use-hook/use-sortable-data'
import FormCompanyStaff from './form-company-staff'
import ConfirmPopup from '../../shared/confirmPopup'
import { USER_ROLE_TYPE } from '../../../constants'

export default function CompanyStaffList() {
  const { user } = useAppSelector(selectUserPofile)
  const { users, pending, error, loading } = useAppSelector(selectCompanyStaff)
  const dispatch = useAppDispatch()
  const { items, requestSort, sortConfig } = useSortableData(users, {
    key: 'updated_at',
    direction: 'descending',
  })
  const [show, setShow] = useState(false)
  const [userSelect, setUserSelect] = useState()
  const [itemPerPage] = useState(10)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [staffList, setStaffList] = useState([])
  const [showPopup, setShowPopup] = useState({})

  const handleClose = () => {
    setShow(false)
    dispatch(setErrorMessage(null))
  }
  const handleShow = () => setShow(true)
  const getClassNamesFor = name => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const openEditUser = useCallback(event => {
    handleShow()
    setUserSelect(event)
  }, [])
  const openConfirmDelete = useCallback(event => {
    setConfirmDelete(true)
    setUserSelect(event)
  }, [])

  const updateUser = event => {
    const callUpdate = async () => {
      const response = await dispatch(
        updatedUser({
          id: event?.id,
          firstName: event?.firstName,
          lastName: event?.lastName,
          email: event?.email,
          phone: event?.phone,
          departmentId: event?.departmentId,
        })
      )
      if (response?.payload) {
        setShow(false)
        handleClose()
      }
    }
    callUpdate()
  }

  const deleteUser = event => {
    const callDelete = async () => {
      const response = await dispatch(deletedUser(event))
      if (response?.payload) {
        setConfirmDelete(false)
      }
    }
    callDelete()
  }

  const onPageChange = useCallback(event => {
    setCurrentPage(event)
  }, [])

  useEffect(() => {
    const pageIndex = currentPage - 1
    setStaffList(
      items.slice(
        pageIndex * itemPerPage,
        pageIndex * itemPerPage + itemPerPage
      )
    )
  }, [items, currentPage])

  useEffect(() => {
    if (get(user, 'companies[0].id')) {
      dispatch(
        getStaffUsers({
          companyId: get(user, 'companies[0].id'),
        })
      )
    }
    return () => {
      dispatch(setUsers(null))
    }
  }, [user])

  const toggleShowPopup = useCallback(
    itemId => {
      setShowPopup(prev => ({
        ...prev,
        [itemId]: !showPopup[itemId],
      }))
    },
    [showPopup]
  )

  const updateStaffRole = useCallback(
    async itemId => {
      const payload = {
        userId: itemId,
        roleType: 'client',
      }
      const res = await dispatch(updateUserRole(payload))
      if (res.payload) {
        toggleShowPopup(itemId)
        dispatch(
          getStaffUsers({
            companyId: get(user, 'companies[0].id'),
          })
        )
        toast.success('Update staff role successfully!')
      }
      if (get(res, 'error.message') || error) {
        toast.error(error)
      }
    },
    [toggleShowPopup]
  )

  const isDisableUpdateUser = staffItem => {
    if (
      staffItem.previousRole &&
      staffItem.previousRole.type === USER_ROLE_TYPE.staff
    ) {
      return true
    }
    if (!user.previousRole) {
      return !!user.previousRole || false
    }
    return true
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table align-items-center">
          <thead>
            <tr>
              <th scope="col">
                <span
                  aria-hidden="true"
                  onClick={() => requestSort('name')}
                  className={getClassNamesFor('name')}
                >
                  Name
                  {getClassNamesFor('name') === 'descending' && (
                    <i className="fas fa-arrow-up ml-2"></i>
                  )}
                  {getClassNamesFor('name') === 'ascending' && (
                    <i className="fas fa-arrow-down ml-2"></i>
                  )}
                </span>
              </th>
              <th scope="col">
                <span
                  aria-hidden="true"
                  onClick={() => requestSort('email')}
                  className={getClassNamesFor('email')}
                >
                  Email
                  {getClassNamesFor('email') === 'descending' && (
                    <i className="fas fa-arrow-up ml-2"></i>
                  )}
                  {getClassNamesFor('email') === 'ascending' && (
                    <i className="fas fa-arrow-down ml-2"></i>
                  )}
                </span>
              </th>
              <th scope="col">
                <span
                  aria-hidden="true"
                  onClick={() => requestSort('phone')}
                  className={getClassNamesFor('phone')}
                >
                  Phone
                  {getClassNamesFor('phone') === 'descending' && (
                    <i className="fas fa-arrow-up ml-2"></i>
                  )}
                  {getClassNamesFor('phone') === 'ascending' && (
                    <i className="fas fa-arrow-down ml-2"></i>
                  )}
                </span>
              </th>
              <th scope="col">
                <span
                  aria-hidden="true"
                  onClick={() => requestSort('department')}
                  className={getClassNamesFor('department')}
                >
                  Department
                  {getClassNamesFor('department') === 'descending' && (
                    <i className="fas fa-arrow-up ml-2"></i>
                  )}
                  {getClassNamesFor('department') === 'ascending' && (
                    <i className="fas fa-arrow-down ml-2"></i>
                  )}
                </span>
              </th>
              <th scope="col" data-width="120">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {staffList.map(item => (
              <tr key={item.id}>
                <th scope="row">
                  <span className="client">{item?.name || ''}</span>
                </th>
                <td className="order">
                  <span className="date">{item?.email || ''}</span>
                </td>
                <td>
                  <span className="value text-sm mb-0">
                    {item?.phone || ''}
                  </span>
                </td>
                <td>
                  <span className="value text-sm mb-0">
                    {item?.departmentId?.name || 'None'}
                  </span>
                </td>
                <td>
                  <div>
                    <ConfirmPopup
                      id={item.id}
                      showPopup={showPopup[item.id] || false}
                      title="Are your sure to update this staff to client role?"
                      onCancel={toggleShowPopup}
                      onOk={updateStaffRole}
                      childrenComponent={
                        <button
                          disabled={isDisableUpdateUser(item)}
                          type="button"
                          title="Update to client role"
                          className="btn btn-sm btn-primary btn-icon-only"
                          onClick={() => toggleShowPopup(item.id)}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-users-cog" />
                          </span>
                        </button>
                      }
                    />

                    <button
                      type="button"
                      title="Edit User"
                      onClick={() => {
                        openEditUser(item)
                      }}
                      className="btn btn-sm btn-primary btn-icon-only"
                    >
                      <span className="btn-inner--icon">
                        <i className="far fa-edit"></i>
                      </span>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => {
                        openConfirmDelete(item)
                      }}
                      className="btn btn-sm btn-danger btn-icon-only"
                    >
                      <span className="btn-inner--icon">
                        <i className="far fa-trash-alt"></i>
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pending && (
        <p className="text-center mt-3">
          <Spinner animation="border" variant="primary" size="sm" />
          <span className="pt-1 d-inline-block align-middle ml-2">
            loading data...
          </span>
        </p>
      )}
      {items.length === 0 && !pending && (
        <p className="text-center mt-3">No Staff found</p>
      )}
      {items?.length > itemPerPage && (
        <div className="my-4 d-flex text-center">
          <PaginationOwn
            totalItems={items?.length}
            itemPerPage={itemPerPage}
            pageChange={onPageChange}
          />
        </div>
      )}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update User Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <FormCompanyStaff
            onUpdateUser={updateUser}
            data={userSelect}
            onCancel={handleClose}
            loading={loading}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={confirmDelete}
        centered
        onHide={() => {
          setConfirmDelete(false)
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <p>Are you sure want to delete this staff?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-sm btn-danger"
            disabled={loading}
            onClick={() => {
              deleteUser(userSelect)
            }}
          >
            {loading && <Spinner animation="border" size="sm" />}
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            disabled={pending}
            onClick={() => {
              setConfirmDelete(false)
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
