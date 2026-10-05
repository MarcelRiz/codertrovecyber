/* eslint-disable @next/next/link-passhref */
import React from 'react'
import { Card, Col } from 'react-bootstrap'
import Link from 'next/link'
import styles from './styles.module.scss'

const { Body: CardBody } = Card
export default function OverallStatusCard({ user }) {
  return (
    <Card className="mb-3 hover-shadow-lg">
      <Link href={{
          query: { userId: user.userId },
        }}
      >
        <CardBody className={`d-flex align-items-start align-items-lg-center px-2 py-3 ${styles['card-body']}`}>
          <Col xs={2}>
              <b className='mr-1'>{user?.firstName}</b>
              <b>{user?.lastName}</b>
          </Col>
          <Col xs={3} className='mr-3'>{user?.email}</Col>
          <Col xs={1} className='mr-5'>{user?.course?.completed}</Col>
          <Col xs={2}>{user?.course?.pending}</Col>
          <Col xs={2}>{user?.policy?.acknowledged}</Col>
          <Col xs={2}>{user?.policy?.pending}</Col>
        </CardBody>
      </Link>
    </Card>
  )
}
