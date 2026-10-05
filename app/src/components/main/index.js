import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export default function Main({ children }) {
  return (
    <div className="slice slice-sm bg-section-secondary">
      <Container>
        <Row className="justify-content-center">
          <Col lg={12}>{children}</Col>
        </Row>
      </Container>
    </div>
  )
}
