import React from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { closeCheckinModal } from '../../states/checkins'
import CheckinComments from '../checkin-comments'

export default function ModalCheckinMeeting() {
  const { showCheckinModal } = useSelector(state => state.checkins)
  const dispatch = useDispatch()
  return (
    <Modal
      show={showCheckinModal}
      onHide={() => {
        dispatch(closeCheckinModal())
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Checkin Meeting Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-muted">Conducted on 12 Aug 2021</h5>
        <h5>Meeting Summary</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc iaculis
          elit ultrices, eleifend massa sit amet, faucibus magna. Ut pharetra
          lorem vel leo elementum, id pulvinar metus tempus. Nulla facilisi.
          Cras a faucibus justo. Ut posuere rutrum turpis, quis commodo augue
          sodales eget. Quisque fringilla dignissim nisi a vulputate. Etiam non
          neque in lectus facilisis faucibus.
        </p>
        <hr />
        <CheckinComments />
      </Modal.Body>
    </Modal>
  )
}
