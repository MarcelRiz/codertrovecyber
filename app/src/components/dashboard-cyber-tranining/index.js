import React, { useContext, useMemo } from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import { AlertCircle, Book as IconBook } from 'react-feather'
import { useSelector } from 'react-redux'
import AppContext from '../../contexts/app-context'

export default function DashboardCyberTraining() {
  const { user } = useSelector(state => state.auth?.session)
  const { isClient } = useContext(AppContext)

  /**
   * check if user have staffs
   * @type {boolean}
   */
  const havingStaffs = useMemo(() => !!user?.children?.length, [user])

  return (
    <Card>
      <Card.Body>
        <IconBook size={32} />
        <Card.Title className="mt-3">Education Centre</Card.Title>
        <div className="text-muted mb-3">
          {isClient
            ? 'Here lives the education packages that your team can review to drive home best practice in real life situations with a short course attached to the content.'
            : 'Improve your awareness of cybersecurity threats.'}
        </div>

        {!havingStaffs && isClient && (
          <>
            <Link href="/company-settings">
              <Alert variant="warning" style={{ cursor: 'pointer' }}>
                <AlertCircle color="white" size={16} className="mr-2" />
                To get started, add your staff so they can complete all Cyber
                security courses
              </Alert>
            </Link>
          </>
        )}
        <div className="mt-3">
          <Link href="/education-centre">
            <Button variant="primary">Go to education centre</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
