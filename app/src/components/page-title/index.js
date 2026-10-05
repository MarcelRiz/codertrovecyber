import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

export default function PageTitle({ title, subtitle, children }) {
  return (
    <section className="pt-3 bg-section-secondary">
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col lg={8}>
            <Row className="align-items-center">
              <Col>
                <h1 className="h2 mb-0">{title}</h1>
                {subtitle && <span className="surtitle">{subtitle}</span>}
              </Col>
            </Row>
          </Col>
          {children}
        </Row>
      </Container>
    </section>
  )
}
