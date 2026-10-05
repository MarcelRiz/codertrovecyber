import React, { useCallback } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormEditStaff from '../form-edit-staff'
import { closeAddModal } from '../../states/staffs'
import FormUploadStaffsCsv from '../form-upload-staffs-csv'

export default function ModalAddStaffs() {
  const showAddModal = useSelector(state => state.staffs.showAddModal)
  const dispatch = useDispatch()

  /**
   * on closing modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(closeAddModal())
  }, [dispatch])

  return (
    <Modal show={showAddModal} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add Company Staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          We have automated the enrolment process for your staff to ensure
          education is at the forefront of their development. Additionally, your
          team will be sent governance documents as they are created and
          notified instantly as they change ensuring compliance can be tracked
          and acknowledged easily.
        </p>
        <p>
          Enter the details of the company staff you want to add to the
          platform.
        </p>
        <Row>
          <Col lg={6} className="mb-3">
            <h5>Add Company Staff Individually</h5>
            <FormEditStaff />
          </Col>
          <Col lg={6} className="mb-3">
            <h5>Add Company Staff in Bulk</h5>
            <FormUploadStaffsCsv />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
