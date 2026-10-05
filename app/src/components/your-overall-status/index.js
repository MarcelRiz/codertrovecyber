import React, { useCallback, useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { PieChart as IconPercent } from 'react-feather'
import { useDispatch } from 'react-redux'
import YourPolicyStatus from '../your-policy-status'
import YourAwareness from '../your-awareness'
import { getUserSummary } from '../../states/auth'

export default function YourOverallStatus() {
  const dispatch = useDispatch()
  const fetchSummary = useCallback(() => {
    dispatch(getUserSummary())
  }, [dispatch])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <Card style={{ minHeight: 'calc(100% - 30px)' }}>
      <Card.Body className="d-lg-flex flex-lg-column justify-content-center">
        <div className="text-center mb-3">
          <IconPercent size={32} />
        </div>
        <h3 className="text-center">Overall Status</h3>
        <Row className="mx-n2">
          <Col lg={6} className="px-2">
            <YourPolicyStatus />
          </Col>

          <Col lg={6} className="px-2">
            <YourAwareness />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
