import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { closeEditStaff } from '../../states/staffs'
import FormEditStaff from '../form-edit-staff'

export default function ModalEditStaff() {
  const showEditModal = useSelector(state => state.staffs.showEditModal)
  const dispatch = useDispatch()

  /**
   * on closing modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(closeEditStaff())
  }, [dispatch])

  return (
    <Modal show={showEditModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit staff</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormEditStaff onComplete={onClose} />
      </Modal.Body>
    </Modal>
  )
}
