import React, { useCallback, useMemo } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import {
  closeAcknowledgePolicy,
  getAssignedPolicies,
  sendAcknowledgePolicy,
} from '../../states/policies'
import PdfViewer from '../pdf-viewer'

export default function ModalAcknowledgement() {
  const { acknowledgePolicy, showAcknowledgeModal, sendingAcknowledgment } =
    useSelector(state => state.policies)
  const dispatch = useDispatch()

  /**
   * on close acknowledge modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(closeAcknowledgePolicy())
  }, [dispatch])

  /**
   * submit acknowledgement
   * @type {(function(): void)|*}
   */
  const sendAcknowledgement = useCallback(() => {
    dispatch(sendAcknowledgePolicy(acknowledgePolicy.id))
      .unwrap()
      .then(() => {
        toast.success('Policy acknowledged')
        dispatch(getAssignedPolicies())
        onClose()
      })
      .catch(error => {
        toast.warn(error.message || 'Could not send policy acknowledgement')
      })
  }, [acknowledgePolicy, dispatch, onClose])

  /**
   * get pdf link
   * @type {string}
   */
  const pdfLink = useMemo(
    () => `${process.env.NEXT_PUBLIC_API}${acknowledgePolicy?.policyFile?.url}`,
    [acknowledgePolicy?.policyFile?.url]
  )

  return (
    <Modal show={showAcknowledgeModal} size="xl" onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PdfViewer file={pdfLink} onLoadSuccess={() => {}} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn-block btn-icon"
          disabled={sendingAcknowledgment}
          onClick={sendAcknowledgement}
        >
          {sendingAcknowledgment && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
          <span className="btn-inner--text">Acknowledge policy</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
