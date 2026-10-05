import React, { useEffect, useState, useCallback } from 'react'
import * as Icon from 'react-feather'
import Link from 'next/link'
import Head from 'next/head'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'

import DefaultLayout from '../../src/layout/default'
import { Breadcrumb } from '../../src/components'
import { useAppDispatch, useAppSelector } from '../../src/states/hooks'
import {
  getUsers,
  deletedUser,
  selectUserManagement,
  changeBlockStatus,
  updateUserStatus,
} from '../../src/states/features/userManagementSlice'
import { putUser } from '../../src/states/features/userProfileSlice'
import styles from './styles.module.scss'
import useSortableData from '../../src/components/use-hook/use-sortable-data'
import { PaginationOwn } from '../../src/components/shared'

export default function UserManager() {
  const { users, pending } = useAppSelector(selectUserManagement)
  const dispatch = useAppDispatch()
  const [dateSearch, setDateSearch] = useState()
  const [filterKeys, setFilterKeys] = useState({})
  const [listUserFilter, setListUserFilterr] = useState([])
  const [listUser, setListUser] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { items, requestSort, sortConfig } = useSortableData(users, {
    key: 'created_at',
    direction: 'descending',
  })
  const [userSelect, setUserSelect] = useState(null)
  const [itemPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [confirmChangeStatus, setConfirmChangeStatus] = useState(false)
  const [isShowResetPassword, setIsShowResetPassword] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')

  const getClassNamesFor = name => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  useEffect(() => {
    function getData() {
      dispatch(getUsers())
    }
    getData()
  }, [])

  const deleteUser = value => {
    setUserSelect(value)
    setConfirmDelete(true)
  }

  const onDeleteUser = () => {
    setConfirmDelete(false)
    setEmailConfirm('')
    dispatch(deletedUser(userSelect))
  }

  const filterData = (event, key) => {
    const searchKey = {
      ...filterKeys,
      [key]: event.target.value,
    }
    setFilterKeys(searchKey)
  }

  const onPageChange = useCallback(event => {
    setCurrentPage(event)
  }, [])

  const openChangeBlockStatus = useCallback(value => {
    setConfirmChangeStatus(true)
    setUserSelect(value)
  }, [])

  const onChangeBlockStatus = useCallback(async value => {
    setActionLoading(true)
    setMessageError('')
    const res = await dispatch(changeBlockStatus({ userId: value?.id }))
    if (res?.payload) {
      dispatch(updateUserStatus(value))
      setConfirmChangeStatus(false)
      setActionLoading(false)
      return
    }
    let resError = null
    resError = res
    setActionLoading(false)
    setMessageError(resError?.error?.message)
  }, [])

  const onResetPassword = user => {
    setUserSelect(user)
    setIsShowResetPassword(true)
  }

  const handleResetPassword = async user => {
    setActionLoading(true)
    setMessageError('')
    const res = await dispatch(
      putUser({
        ...user,
        isGenerateNewPassword: true,
      })
    )
    if (res?.payload) {
      setIsShowResetPassword(false)
      setActionLoading(false)
      toast.success('Reset Password Successfully.')
      return
    }
    let resError = null
    resError = res
    setActionLoading(false)
    setMessageError(resError?.error?.message)
  }

  useEffect(() => {
    function filterByField(data) {
      return Object.entries(filterKeys).every(([key, value]) => {
        if (value === '' || value === null) {
          return true
        }
        if (key === 'created_at') {
          return (
            moment(value).format('DDMMYYYY') ===
            moment(data[key]).format('DDMMYYYY')
          )
        }
        const string = value.toString()
        return data[key]?.toLowerCase().indexOf(string?.toLowerCase()) > -1
      })
    }
    let list = items
    if (Object.keys(filterKeys).length > 0) {
      list = list.filter(item => filterByField(item))
    }
    setListUserFilterr(list)
  }, [items, filterKeys])

  useEffect(() => {
    const pagIndex = currentPage - 1
    setListUser(
      listUserFilter.slice(
        pagIndex * itemPerPage,
        pagIndex * itemPerPage + itemPerPage
      )
    )
  }, [listUserFilter, currentPage])

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - User Management</title>
      </Head>
      <DefaultLayout>
        <Breadcrumb>
          <span className="breadcrumb-icon">
            <Icon.User className={styles['navbar-icon']} />
          </span>
          User Management
        </Breadcrumb>
        <div className="page-container">
          <div className="row">
            <div className="col-12">
              <div className="card card-fluid d-block justify-content-center mb-0">
                <div className="card-header pb-3">
                  <div className="row align-items-center">
                    <div className="col ml-md-n2">
                      <h5 className="d-block h3 mb-0">Customer List</h5>
                    </div>
                    <div className="col-auto">
                      <div className="text-right">
                        <Link href="/user-manager/add-user">
                          <a href="#!" className="btn btn-sm btn-primary mt-2">
                            <Icon.UserPlus /> Add New User
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`card-body ${styles.userManagementList}`}>
                  <div
                    className={`table-responsive pb-3 ${styles.userManagementTable}`}
                  >
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
                              onClick={() => requestSort('companyName')}
                              className={getClassNamesFor('companyName')}
                            >
                              Company
                              {getClassNamesFor('companyName') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('companyName') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('version')}
                              className={getClassNamesFor('version')}
                            >
                              Subscription Plan
                              {getClassNamesFor('version') === 'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('version') === 'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('created_at')}
                              className={getClassNamesFor('created_at')}
                            >
                              Signup Date
                              {getClassNamesFor('created_at') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('created_at') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col" style={{ minWidth: '230px' }}>
                            Action
                          </th>
                        </tr>
                        <tr>
                          <th>
                            <div className="form-group mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event => filterData(event, 'name')}
                                placeholder={`Search ${users?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event => filterData(event, 'email')}
                                placeholder={`Search ${users?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event =>
                                  filterData(event, 'companyName')
                                }
                                placeholder={`Search ${users?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event => filterData(event, 'version')}
                                placeholder={`Search ${users?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <div className="input-group input-group-merge">
                                <div className="input-group-append date-group">
                                  <DatePicker
                                    selected={dateSearch}
                                    onChange={date => {
                                      setDateSearch(date)
                                      filterData(
                                        { target: { value: date } },
                                        'created_at'
                                      )
                                    }}
                                  />
                                  <span className="input-group-text">
                                    <Icon.Calendar />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th scope="col">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listUser.map(user => (
                          <tr key={user.id}>
                            <th scope="row">
                              <span className="client">{user.name}</span>
                            </th>
                            <td className="order">
                              <span className="date">{user.email}</span>
                            </td>
                            <td>
                              <span className="value text-sm mb-0">
                                {user.companyName || '-'}
                              </span>
                            </td>
                            <td>
                              <span className="value text-sm mb-0">
                                {user.version === 'free' ? 'Free' : 'Paid'}
                              </span>
                            </td>
                            <td>
                              <span className="taxes text-sm mb-0">
                                {moment(user.created_at).format('LL')}
                              </span>
                            </td>
                            <td>
                              <div className="d-inline-flex">
                                <Link href={`/user-manager/${user.id}`}>
                                  <a
                                    href="#!"
                                    className="btn btn-sm btn-primary px-3"
                                  >
                                    <span
                                      title="View"
                                      className="btn-inner--icon"
                                    >
                                      <i className="far fa-eye"></i>
                                    </span>
                                  </a>
                                </Link>
                                <button
                                  type="button"
                                  title={user?.blocked ? 'Unblock' : 'Block'}
                                  onClick={() => openChangeBlockStatus(user)}
                                  className="btn btn-sm btn-danger"
                                >
                                  <span className="btn-inner--icon">
                                    {(!user?.blocked && (
                                      <i className="fas fa-lock-open"></i>
                                    )) || <i className="fas fa-lock"></i>}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => deleteUser(user)}
                                  className="btn btn-sm btn-danger btn-icon-only"
                                >
                                  <span className="btn-inner--icon">
                                    <i className="far fa-trash-alt"></i>
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  title="Reset Password"
                                  onClick={() => onResetPassword(user)}
                                  className="btn btn-sm btn-danger btn-icon-only"
                                >
                                  <span className="btn-inner--icon">
                                    <i className="fas fa-key"></i>
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {pending && (
                      <div className="text-center mt-3">
                        <Spinner
                          animation="border"
                          variant="primary"
                          size="sm"
                        />
                        <span className="pt-1 d-inline-block align-middle ml-2">
                          loading data...
                        </span>
                      </div>
                    )}
                    {listUser.length === 0 && !pending && (
                      <p className="text-center mt-3">No user found</p>
                    )}
                    {listUserFilter?.length > itemPerPage && (
                      <div className="my-4 d-flex text-center">
                        <PaginationOwn
                          totalItems={listUserFilter?.length}
                          itemPerPage={itemPerPage}
                          pageChange={onPageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Modal
        show={confirmDelete}
        centered
        onHide={() => {
          setConfirmDelete(false)
          setEmailConfirm('')
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Deleting this user will also delete all data associated to it and
            can not be undone.
            <br /> Are you sure you want to delete {userSelect?.email}?
          </p>
          <Form.Group>
            <Form.Label htmlFor="email">
              Please enter {userSelect?.email} to confirm:
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={emailConfirm}
              onChange={event => setEmailConfirm(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-sm btn-danger"
            disabled={emailConfirm !== userSelect?.email}
            onClick={onDeleteUser}
          >
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            onClick={() => {
              setConfirmDelete(false)
              setEmailConfirm('')
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={confirmChangeStatus}
        centered
        onHide={() => {
          setConfirmChangeStatus(false)
          setMessageError('')
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messageError && (
            <div className="alert alert-danger" role="alert">
              {messageError}
            </div>
          )}
          <p>
            Are you sure want to {userSelect?.blocked ? 'Unblock' : 'Block'}{' '}
            this user?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-sm btn-danger"
            disabled={actionLoading}
            onClick={() => {
              onChangeBlockStatus(userSelect)
            }}
          >
            {actionLoading && <Spinner animation="border" size="sm" />}
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            onClick={() => {
              setConfirmChangeStatus(false)
              setMessageError('')
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isShowResetPassword}
        centered
        onHide={() => {
          setIsShowResetPassword(false)
          setMessageError('')
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messageError && (
            <div className="alert alert-danger" role="alert">
              {messageError}
            </div>
          )}
          <p>
            Are you sure you want to reset password for {userSelect?.email}?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-sm btn-danger"
            disabled={actionLoading}
            onClick={() => {
              handleResetPassword(userSelect)
            }}
          >
            {actionLoading && <Spinner animation="border" size="sm" />}
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            onClick={() => {
              setIsShowResetPassword(false)
              setMessageError('')
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
