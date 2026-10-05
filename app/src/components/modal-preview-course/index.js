import React, { useCallback } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { closeCourse, openCourseTypeform } from '../../states/security-academy'

export default function ModalPreviewCourse() {
  const { viewingCourse, showCourseModal } = useSelector(
    state => state.securityAcademy
  )
  const dispatch = useDispatch()

  /**
   * on close modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(closeCourse())
  }, [dispatch])

  /**
   * on opening typeform
   * @type {(function(): void)|*}
   */
  const openTypeform = useCallback(() => {
    onClose()
    dispatch(openCourseTypeform(viewingCourse))
  }, [onClose, dispatch, viewingCourse])

  if (!viewingCourse) return null

  return (
    <Modal show={showCourseModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{viewingCourse?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-5">
          <Button
            variant="primary"
            size="lg"
            onClick={openTypeform}
            className="btn-icon"
          >
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faPlay} />
            </span>
            <span className="btn-inner--text">Start</span>
          </Button>
        </div>
        <h5>Acknowledgement</h5>
        <p>
          The user will be asked to tick a box to acknowledge that they have
          completed this course and understand the content.
        </p>
      </Modal.Body>
    </Modal>
  )
}
