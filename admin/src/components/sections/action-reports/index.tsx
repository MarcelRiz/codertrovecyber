import React, { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import useSortableData from '../../use-hook/use-sortable-data'
import {
  getActionReport,
  selectActionReport,
  createActionReport,
  setError,
  deleteActionReport,
  updateActionReport
} from '../../../states/features/actionReportsSlice'
import FormReportItem from './form-report-item'
import { addFile, selectfile } from '../../../states/features/fileSlice'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { DownloadFile } from '../../../utilities/helps'
import { PaginationOwn } from '../../shared'

export default function ActionReports() {
  const dispatch = useAppDispatch()
  const { entities, pending, error, loading } = useAppSelector(selectActionReport)
  const { user } = useAppSelector(selectUserPofile)
  const { pendingUpload } = useAppSelector(selectfile)
  const { items, requestSort, sortConfig } = useSortableData(entities, { key: 'updated_at', direction: 'descending' })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [reportSelect, setReportSelect] = useState()
  const [show, setShow] = useState(false)
  const [itemPerPage] = useState(10)
  const [reportsList, setReportsList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const handleClose = () => {
    setReportSelect(null)
    dispatch(setError(''))
    setShow(false)
  }
  const handleShow = () => setShow(true)
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const createReport = useCallback((event) => {
    const createNewReport = async () => {
      const responseUploadFile = await dispatch(addFile({ file: event.reportFile[0] }))
      let fileUpload = null
      fileUpload = responseUploadFile?.payload
      if (fileUpload?.data?.length < 1) {
        return
      }
      const response = await dispatch(createActionReport({
        ...event,
        pdf: fileUpload?.data[0]?.id,
        user: event?.userId
      }))
      if (response.payload) {
        handleClose()
      }
    }
    dispatch(setError(''))
    createNewReport()
  }, [])

  const onDeleteUser = useCallback((event) => {
    const deleteReportAPIs = async () => {
      const response = await dispatch(deleteActionReport({ id: event.id }))
      if (response.payload) {
        setConfirmDelete(false)
      }
    }
    dispatch(setError(''))
    deleteReportAPIs()
  }, [])

  const onUpdateReport = useCallback((event) => {
    const updatedReport = async () => {
      let fileUpload = null
      let payload = null
      payload = {
        id: event.id,
        name: event.name,
        reportType: event.reportType
      }
      if (event?.reportFile?.length > 0) {
        const responseUploadFile = await dispatch(addFile({ file: event.reportFile[0] }))
        fileUpload = responseUploadFile?.payload
        if (fileUpload?.data?.length > 0) {
          payload = {
            ...payload,
            pdf: fileUpload?.data[0]?.id
          }
        }
      }
      const response = await dispatch(updateActionReport(payload))
      if (response.payload) {
        handleClose()
      }
    }
    dispatch(setError(''))
    updatedReport()
  }, [])

  useEffect(() => {
    const pageIndex = currentPage - 1
    setReportsList(items.slice(pageIndex * itemPerPage, (pageIndex * itemPerPage) + itemPerPage))
  }, [items, currentPage])

  const openUpdatedReport = (value) => {
    handleShow()
    setReportSelect(value)
  }

  const deleteReport = (value) => {
    setReportSelect(value)
    setConfirmDelete(true)
  }

  const onPageChange = useCallback((event) => {
    setCurrentPage(event)
  }, [])

  useEffect(() => {
    if(user?.id) {
      dispatch(getActionReport(user))
    }    
    return (() => {
      dispatch(setError(''))
    })
  }, [user?.id])

  return (
    <>
      <div className="row align-items-center mb-3">
        <div className="col">
          <h3>Action Reports</h3>
        </div>
        <div className="col-auto">
          <div className="text-right">
            <button type="button" onClick={handleShow} className="btn btn-sm btn-primary">
              <i className="far fa-file-pdf mr-2"></i>
              Add New Report</button>
          </div>
        </div>
      </div>
      <div className="card-body px-0">
        <div className="table-responsive">
          <table className="table align-items-center">
            <thead>
              <tr>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('name')} className={getClassNamesFor('name')} >
                    Report
                    {getClassNamesFor('name') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('name') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('updated_at')} className={getClassNamesFor('updated_at')} >
                    Last Published
                    {getClassNamesFor('updated_at') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('updated_at') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('pdfName')} className={getClassNamesFor('pdfName')} >
                    PDF link
                    {getClassNamesFor('pdfName') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('pdfName') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span>
                </th>
                <th scope="col">
                  <span aria-hidden="true" onClick={() => requestSort('reportTypeName')} className={getClassNamesFor('reportTypeName')} >
                    Report Type
                    {getClassNamesFor('reportTypeName') === 'descending' && <i className="fas fa-arrow-up ml-2"></i>}
                    {getClassNamesFor('reportTypeName') === 'ascending' && <i className="fas fa-arrow-down ml-2"></i>}
                  </span></th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                reportsList.map(item => (
                  <tr key={item.id}>
                    <th scope="row">
                      <span className="client">{item?.name}</span>
                    </th>
                    <td className="order">
                      <span className="date">{item?.updated_at && moment(item?.updated_at).format('LL') || ''}</span>
                    </td>
                    <td>
                      <span className="value text-sm mb-0">
                        <button type="button" className="btn btn-link p-0" onClick={() => DownloadFile(`${process.env.NEXT_PUBLIC_API_URL}${item?.pdfUrl}`, item.pdfName)} >
                          {item.pdfName}
                        </button>
                      </span>
                    </td>
                    <td>
                      <span className="value text-sm mb-0">{item?.reportType?.name}</span>
                    </td>
                    <td>
                      <div>
                        <button type="button" title="Edit" onClick={() => { openUpdatedReport(item) }} className="btn btn-sm btn-primary btn-icon-only">
                          <span className="btn-inner--icon">
                            <i className="far fa-edit"></i>
                          </span>
                        </button>
                        <button type="button" title="Delete" onClick={() => { deleteReport(item) }} className="btn btn-sm btn-danger btn-icon-only">
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
          {items.length === 0 && !pending && <p className="text-center mt-3">No Report found</p>}
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
          <Modal.Title>Add New Report Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <FormReportItem onCreateActionItem={createReport} onUpdateActionItem={onUpdateReport} data={reportSelect} onCancel={handleClose} loading={loading || pendingUpload} />
        </Modal.Body>
      </Modal>
      <Modal show={confirmDelete} centered onHide={() => { handleClose(); setConfirmDelete(false); dispatch(setError('')) }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <p>Are you sure want to delete this report?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger" disabled={pending} onClick={() => { onDeleteUser(reportSelect) }}>
            {pending && <Spinner animation="border" size="sm" />}
            Yes</Button>
          <Button className="btn-sm btn-secondary" disabled={pending} onClick={() => { handleClose(); setConfirmDelete(false) }}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}