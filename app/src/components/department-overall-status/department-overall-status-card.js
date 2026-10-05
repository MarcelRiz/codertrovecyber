/* eslint-disable @next/next/link-passhref */
import React from 'react'
import { Card, Col } from 'react-bootstrap'
import styles from './styles.module.scss'

const { Body: CardBody } = Card
export default function OverallCard({ department }) {
  return (
    <Card className="mb-3 hover-shadow-lg">
        <CardBody className={`d-flex text-center align-items-start align-items-lg-center px-2 py-3 ${styles['card-body']}`}>
            <Col xs={2}>{department?.name}</Col>
            <Col xs={3}>{department?.completedCourses}</Col>
            <Col xs={2}>{department?.pendingCourses}</Col>
            <Col xs={3}>{department?.acknowledgedPolicies}</Col>
            <Col xs={2}>{department?.pendingPolicies}</Col>
        </CardBody>
    </Card>
  )
}
