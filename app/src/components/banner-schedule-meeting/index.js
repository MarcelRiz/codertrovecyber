import React from 'react'
import { Alert, Button } from 'react-bootstrap'

export default function BannerScheduleMeeting() {
  return (
    <Alert variant="light" className="mt-3">
      <Alert.Heading>
        Require assistance in understanding these threats?
      </Alert.Heading>
      <div className="d-lg-flex align-items-start justify-content-between">
        <p className="pr-3">
          We strongly recommend that you schedule a meeting with one of our
          consultants if you are unsure about any of the action items listed
          here
        </p>
        <Button
          id="schedule_review"
          variant="info"
          className="rounded-pill"
          href="https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting"
          target="_blank"
        >
          Schedule a review
        </Button>
      </div>
    </Alert>
  )
}
