import React, { useEffect, useState, useCallback } from 'react'
import * as Icon from 'react-feather'
import moment from 'moment'
import { Button, Modal, Spinner } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAppDispatch, useAppSelector } from '@states/hooks'
import useSortableData from '@src/components/use-hook/use-sortable-data'
import { selectUserPofile } from '@states/features/userProfileSlice'
import {
  getScanningList,
  createScanning,
  deletedScanning,
  updateScanning,
  selectManageScanningManagement,
} from '@src/states/features/manageScanningSlice'
import { PaginationOwn } from '@src/components/shared'
import FormDomain from './form-domain'
import styles from './styles.module.scss'

export default function ManageDomain() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectUserPofile)
  const { scanningList, pending, error } = useAppSelector(
    selectManageScanningManagement
  )
  const [dateSearch, setDateSearch] = useState()
  const [filterKeys, setFilterKeys] = useState({})
  const [showModal, setShowModal] = useState(null)
  const [selectedScan, setSelectedScan] = useState(null)
  const { items, requestSort, sortConfig } = useSortableData(scanningList, {
    key: 'createdAt',
    direction: 'descending',
  })
  const [itemPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [listScanFilter, setListScanFilter] = useState([])
  const [listScan, setListScan] = useState([])

  const fetchScanningList = useCallback(async () => {
    if (user && user.id) {
      dispatch(getScanningList({ userId: user.id }))
    }
  }, [user])

  useEffect(() => {
    fetchScanningList()
  }, [fetchScanningList])

  const getClassNamesFor = name => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const filterData = (event, key) => {
    const searchKey = {
      ...filterKeys,
      [key]: event.target.value,
    }
    setFilterKeys(searchKey)
  }

  useEffect(() => {
    function filterByField(data) {
      return Object.entries(filterKeys).every(([key, value]) => {
        if (value === '' || value === null) {
          return true
        }
        if (key === 'createdAt') {
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
    setListScanFilter(list)
  }, [items, filterKeys])

  useEffect(() => {
    const pagIndex = currentPage - 1
    setListScan(
      listScanFilter.slice(
        pagIndex * itemPerPage,
        pagIndex * itemPerPage + itemPerPage
      )
    )
  }, [listScanFilter, currentPage])

  const onPageChange = useCallback(event => {
    setCurrentPage(event)
  }, [])

  const toggleModal = useCallback((toggleAction, value = null) => {
    setShowModal(toggleAction)
    if (!toggleAction) {
      setSelectedScan(null)
    }
    if (value) {
      setSelectedScan(value)
    }
  }, [])

  const handleSubmit = useCallback(
    async data => {
      let response

      if (data.id) {
        if (selectedScan && selectedScan.domain === data.domain) {
          toggleModal(null)
        } else {
          response = await dispatch(
            updateScanning({
              domain: data.domain,
              ownerOfScanner: user.id,
              id: data.id,
            })
          )
        }
      } else {
        response = await dispatch(
          createScanning({
            domain: data.domain,
            ownerOfScanner: user.id,
          })
        )
      }

      if (response?.payload) {
        toggleModal(null)
        fetchScanningList()
      }
    },
    [user, selectedScan]
  )

  const onDeletedScan = useCallback(async () => {
    if (selectedScan) {
      const response = await dispatch(
        deletedScanning({
          id: selectedScan,
        })
      )

      if (response?.payload) {
        toggleModal(null)
        fetchScanningList()
      }
    }
  }, [selectedScan])

  return (
    <>
      <div className="page-container">
        <div className="row">
          <div className="col-12">
            <div className="d-block justify-content-center mb-0">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h5 className="d-block h3 mb-0">Domain List</h5>
                  </div>
                  <div className="col-auto">
                    <div className="text-right">
                      <Button onClick={() => toggleModal('add')}>
                        <Icon.Plus /> Add New Domain
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`card-body ${styles.userManagementList}`}>
                <div
                  className={`table-responsive pb-1 ${styles.userManagementTable}`}
                >
                  <table className="table align-items-center">
                    <thead>
                      <tr>
                        <th scope="col">
                          <span
                            aria-hidden="true"
                            onClick={() => requestSort('domain')}
                            className={getClassNamesFor('domain')}
                          >
                            Domain
                            {getClassNamesFor('domain') === 'descending' && (
                              <i className="fas fa-arrow-up ml-2"></i>
                            )}
                            {getClassNamesFor('domain') === 'ascending' && (
                              <i className="fas fa-arrow-down ml-2"></i>
                            )}
                          </span>
                        </th>
                        <th scope="col">
                          <span
                            aria-hidden="true"
                            onClick={() => requestSort('createdAt')}
                            className={getClassNamesFor('createdAt')}
                          >
                            Created Date
                            {getClassNamesFor('createdAt') === 'descending' && (
                              <i className="fas fa-arrow-up ml-2"></i>
                            )}
                            {getClassNamesFor('createdAt') === 'ascending' && (
                              <i className="fas fa-arrow-down ml-2"></i>
                            )}
                          </span>
                        </th>
                        <th scope="col" style={{ minWidth: '100px' }}>
                          Action
                        </th>
                      </tr>
                      <tr>
                        <th>
                          <div className="form-group mb-0">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              onChange={event => filterData(event, 'domain')}
                              placeholder={`Search ${scanningList?.length} records...`}
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
                                      'createdAt'
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
                      {listScan.map(scanItem => (
                        <tr key={scanItem.id}>
                          <th scope="row">
                            <span className="domain">{scanItem.domain}</span>
                          </th>
                          <td>
                            <span className="taxes text-sm mb-0">
                              {moment(scanItem.createdAt).format('LL')}
                            </span>
                          </td>

                          <td>
                            <div>
                              <button
                                type="button"
                                title="Update"
                                onClick={() => toggleModal('update', scanItem)}
                                className="btn btn-sm btn-primary btn-icon-only"
                              >
                                <span title="Edit" className="btn-inner--icon">
                                  <i className="far fa-edit"></i>
                                </span>
                              </button>
                              <button
                                type="button"
                                title="Delete"
                                onClick={() =>
                                  toggleModal('delete', scanItem.id)
                                }
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
                  {pending && (
                    <div className="text-center mt-3">
                      <Spinner animation="border" variant="primary" size="sm" />
                      <span className="pt-1 d-inline-block align-middle ml-2">
                        Loading Data...
                      </span>
                    </div>
                  )}
                  {listScan.length === 0 && !pending && (
                    <p className="text-center mt-3">Not Found Domain</p>
                  )}
                  {listScanFilter?.length > itemPerPage && (
                    <div className="my-4 d-flex text-center">
                      <PaginationOwn
                        totalItems={listScanFilter?.length}
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

      <Modal
        show={showModal === 'add' || showModal === 'update'}
        onHide={() => toggleModal(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {showModal === 'add' && 'Add New Domain'}
            {showModal === 'update' && 'Update Domain'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <FormDomain
            onSubmitDomain={handleSubmit}
            data={selectedScan || ''}
            onCancel={() => toggleModal(null)}
            loading={pending}
          />
        </Modal.Body>
      </Modal>
      <Modal
        show={showModal === 'delete'}
        centered
        onHide={() => toggleModal(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Domain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this domain {selectedScan?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger" onClick={onDeletedScan}>
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            onClick={() => toggleModal(null)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
