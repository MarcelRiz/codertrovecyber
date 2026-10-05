import React, { useCallback } from 'react'
import { Badge, Card, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import ModalCheckinMeeting from '../modal-checkin-meeting'
import { openCheckinModal } from '../../states/checkins'

export default function CheckinMeetings() {
  const dispatch = useDispatch()
  const openCheckin = useCallback(() => {
    dispatch(openCheckinModal())
  }, [dispatch])

  return (
    <div className="mt-5">
      <Card
        className="mb-3 hover-shadow-lg"
        style={{ cursor: 'pointer' }}
        onClick={openCheckin}
      >
        <Card.Body className="py-3 d-flex flex-wrap flex-md-nowrap">
          <Col xs={8} md={6}>
            Checkin Meeting Title
          </Col>
          <Col xs={4} md={3} className="text-lg-right order-md-2 text-right">
            <Badge variant="success">Completed</Badge>
          </Col>
          <Col md={3} className="text-lg-right">
            January 01, 2021
          </Col>
        </Card.Body>
      </Card>

      <ModalCheckinMeeting />
    </div>
  )
}
