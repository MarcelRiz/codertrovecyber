/* eslint-disable @next/next/link-passhref */
import React, { useMemo } from 'react'
import { Card, Col, Badge } from 'react-bootstrap'

const { Body: CardBody } = Card
export default function OverallStatusDetailCard({ data }) {
  const isPending = useMemo(() => {
    if (data.status === 'Pending') {
      return true
    }
    return false
  }, [data])

  return (
    <Card className="mb-3 hover-shadow-lg" key={data.id}>
      <CardBody className="d-flex align-items-start align-items-lg-center px-2 py-3">
        <Col xs={6} >
          <b>{data?.name}</b>
        </Col>
        <Col xs={6}>
          <Badge variant={isPending ? 'secondary' : 'info'}>
            {data?.status}
          </Badge>
        </Col>
      </CardBody>
    </Card>
  )
}
