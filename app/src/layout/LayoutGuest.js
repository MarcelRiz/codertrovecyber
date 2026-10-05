import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

export default function LayoutGuest({ children }) {
  return (
    <section
      className="section-half-rounded bg-cover bg-size--cover py-4 py-sm-0"
      style={{
        background: 'url(/images/backgrounds/img-3.jpg)',
      }}
    >
      <Container fluid className="d-flex flex-column">
        <Row className="align-items-center min-vh-100">
          <Col md={6} lg={5} xl={4} className="mx-auto">
            <Card className="shadow-lg border-0 mb-0">
              <Card.Body className="py-5 px-sm-5">{children}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

LayoutGuest.propTypes = {
  children: PropTypes.node.isRequired,
}
