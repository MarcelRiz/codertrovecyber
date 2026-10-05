import React, { useState, useCallback, useEffect } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import FormActionItem from './form-action-item'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import {
  createCustomActionItems,
  getActionItems,
  selectActionCenter,
  setError,
  deleteActionItem,
  updatedCustomActionItems,
  resetData,
  deleteCustomActionItem
} from '../../../states/features/actionCenterSlice'
import useSortableData from '../../use-hook/use-sortable-data'
import { ActionItems, ActionStatus, ActionItemSource } from '../../../constants'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { CardResult, PaginationOwn } from '../../shared'
import styles from './styles.module.scss'

export default function ActionCenter() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectUserPofile)
  const { lists, data, pending, error } = useAppSelector(selectActionCenter)
  const { items, requestSort, sortConfig } = useSortableData(lists, { key: 'updated_at', direction: 'descending' })
  const [show, setShow] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [actionSelect, setActionSelect] = useState()
  const [actionList, setActionList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [securityRating, setSecurityRating] = useState(null)
  const itemPerPage = 10
  const handleClose = () => {
    dispatch(setError(''))
    setActionSelect(null)
    setShow(false)
  }
  const handleShow = () => setShow(true)
  const createActionItem = useCallback(
    (event) => {
      const create = async () => {
        const payload = {
          actionItemDetails: event?.actionItemDetails,
          actionItemSource: event?.actionItemSource,
          actionItemSummary: event?.actionItemSummary,
          priority: event?.priority,
          userId: event?.userId,
          category: event?.category,
          controlMapping: event?.controlMapping,
          securityDomain: event?.securityDomain
        }
        const response = await dispatch(createCustomActionItems(payload))
        if (response?.payload) {
          handleClose()
        }
      }
      dispatch(setError(''))
      create()
    }, [])

  const updateActionItem = useCallback(async (event) => {
    const response = await dispatch(updatedCustomActionItems(event))
    if (response?.payload) {
      setActionSelect(null)
      handleClose()
    }
  }, [])

  const openConfirmDelete = useCallback((event) => {
    setConfirmDelete(true)
    setActionSelect(event)    
  }, [])

  const onDeleteAction = async (event) => {
    let response
    if(event?.actionItem?.id) {
      response = await dispatch(deleteActionItem({ id: event?.actionItem?.id }))
    }
    if(event?.customActionItem?.id) {
      response = await dispatch(deleteCustomActionItem({ id: event?.customActionItem?.id }))
    }
    if (response?.payload) {
      setConfirmDelete(false)
      dispatch(getActionItems(user))
    }
  }

  const openUpdateAction = (event) => {
    if (event?.customActionItem) {
      handleShow()
      setActionSelect(event?.customActionItem)
    }
  }

  useEffect(() => {
    if(user?.id) {
      dispatch(getActionItems(user))
    }
    
    return (() => {
      dispatch(setError(''))
      dispatch(resetData(''))
    })
  }, [user])

  useEffect(() => {
    setSecurityRating({
      company: data?.securityRating?.company || 0,
      industry: data?.companies?.length > 0 && data?.companies[0]?.industry?.rating || 0,
      pending: lists?.filter(item => item.state === 'unresolved')?.length || 0
    })
  }, [data, lists])

  useEffect(() => {
    const pageIndex = currentPage - 1
    setActionList(items.slice(pageIndex * itemPerPage, (pageIndex * itemPerPage) + itemPerPage))
  }, [items, currentPage])

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const onPageChange = (event) => {
    setCurrentPage(event)
  }

  return (
    <>
      <h3>Action Center</h3>
      <div className="card-body">
        <h5>Overral Security Rating</h5>
        <div className="row mx-n2">
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Company Security" value={securityRating?.company} icon="fas fa-lock" bg="bg-translucent-danger" />
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Industry Average Security" value={securityRating?.industry} icon="fas fa-industry" bg="bg-translucent-warning" />
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Pending Action Items" value={securityRating?.pending} icon="fas fa-exclamation-circle" bg="bg-translucent-info" />
          </div>
        </div>
        <div className="row align-items-center mb-3">
          <div className="col">
            <h5 className="d-block mb-0">Action List</h5>
          </div>
          <div className="col-auto">
            <div className="text-right">
              <button type="button" onClick={handleShow} className="btn btn-sm btn-primary">
                <i className="fas fa-edit mr-2"></i>
                Add New Action Item</button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-items-top">
            <thead>
              <tr>
                <th scope="col" style={{width: '25%', minWidth: '120px'}}>
                  <span aria-hidden="true" onClick={() => requestSort('actionItemName')} className={getClassNamesFor('actionItemName')} >
                    Action Item
                    {getClassNamesFor('actionItemName') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('actionItemName') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col" style={{minWidth: '120px'}}>
                  <span aria-hidden="true" onClick={() => requestSort('securityDomain')} className={getClassNamesFor('securityDomain')} >
                    Control
                    {getClassNamesFor('securityDomain') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('securityDomain') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col" style={{minWidth: '160px'}}>
                  <span aria-hidden="true" onClick={() => requestSort('controlMapping')} className={getClassNamesFor('controlMapping')} >
                    Control Mapping
                    {getClassNamesFor('controlMapping') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('controlMapping') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('priority')} className={getClassNamesFor('priority')} >
                    Priority
                    {getClassNamesFor('priority') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('priority') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('actionItemSource')} className={getClassNamesFor('actionItemSource')} >
                    Source
                    {getClassNamesFor('actionItemSource') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('actionItemSource') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('category')} className={getClassNamesFor('category')} >
                    Category
                    {getClassNamesFor('category') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('category') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('state')} className={getClassNamesFor('state')} >
                    Status
                    {getClassNamesFor('state') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('state') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col" style={{width: '150px'}}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                actionList.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="client ">{item?.actionItemName}</span>
                    </td>
                    <td>
                      <span className="client ">{item?.controlMapping}</span>
                    </td>
                    <td>
                      <span className="client ">{item?.securityDomain}</span>
                    </td>
                    <td>
                      <span className="client">
                        {ActionItems[item?.priority]}
                      </span>
                    </td>
                    <td className="order">
                      <span className="date">
                        {ActionItems[item?.actionItemSource]}</span>
                    </td>
                    <td className="order">
                      <span className="date">
                        {item?.category}</span>
                    </td>
                    <td>
                      <span className="value text-sm mb-0">{ActionStatus[item?.state]}</span>
                    </td>
                    <td>
                      <div className={`${styles['action-center-buttons']}`} >
                        {item?.type === ActionItemSource.customActionItem &&
                          (
                            <button type="button" title="Edit" onClick={() => { openUpdateAction(item) }} className="btn btn-sm btn-primary btn-icon-only">
                              <span className="btn-inner--icon">
                                <i className="far fa-edit"></i>
                              </span>
                            </button>
                          )}
                        <button type="button" title="Delete" onClick={() => { openConfirmDelete(item) }} className="btn btn-sm btn-danger btn-icon-only">
                          <span className="btn-inner--icon">
                            <i className="far fa-trash-alt"></i>
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {pending &&
            <p className="text-center mt-3">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="pt-1 d-inline-block align-middle ml-2">loading data...</span>
            </p>}
          {items?.length === 0 && !pending && <p className="text-center mt-3">No Action found</p>}
          {
            items?.length > itemPerPage && (
              <div className="my-4 d-flex text-center">
                <PaginationOwn totalItems={items?.length} itemPerPage={itemPerPage} pageChange={onPageChange} />
              </div>
            )
          }
        </div>

      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionSelect && 'Update Action Item'}
            {!actionSelect && 'Add New Action Item'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <FormActionItem
            onCreateActionItem={createActionItem}
            onUpdateActionItem={updateActionItem}
            data={actionSelect}
            onCancel={handleClose} loading={pending} />
        </Modal.Body>
      </Modal>
      <Modal show={confirmDelete} centered onHide={() => { setConfirmDelete(false); dispatch(setError('')) }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <p>Are you sure want to delete this Action?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger" onClick={() => { onDeleteAction(actionSelect) }}>
            {pending && <Spinner animation="border" size="sm" />}
            Yes</Button>
          <Button className="btn-sm btn-secondary" onClick={() => { setConfirmDelete(false); dispatch(setError('')) }}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}