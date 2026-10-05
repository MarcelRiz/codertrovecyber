import React, { useCallback, useEffect } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ReportsList from '../reports-list'
import { getReports, getReportTypes } from '../../states/reports'
import Loading from '../loading'

export default function Reports() {
  const { gettingReports, reportTypes } = useSelector(state => state.reports)
  const dispatch = useDispatch()

  /**
   * get all report types and reports
   * @type {(function(): void)|*}
   */
  const getData = useCallback(() => {
    dispatch(getReportTypes())
    dispatch(getReports())
  }, [dispatch])

  /**
   * on load, get data
   */
  useEffect(() => {
    getData()
  }, [getData])

  /**
   * schedule assistance
   * @type {(function(): void)|*}
   */
  /* const schedule = useCallback(() => {
    Swal.fire({
      title: 'Assistance query created',
      // eslint-disable-next-line quotes
      text: "We're always happy to help you out. Your query has been forwarded to our Cybersecurity Success team. Someone will be in touch soon.",
      icon: 'success',
    })
  }, []) */

  return (
    <div className="mt-5">
      {gettingReports && (
        <div className="text-center">
          <Loading />
        </div>
      )}

      {reportTypes.map((type, index) => (
        <ReportsList key={type.name} reportType={{ ...type, index }} />
      ))}

      <Alert variant="light">
        <Alert.Heading>How to use these reports?</Alert.Heading>
        <div className="d-lg-flex align-items-start justify-content-between">
          <p className="pr-3">
            Get in touch for your review and leverage these insights.
          </p>
          <Button
            variant="info"
            className="rounded-pill"
            href="https://meetings.hubspot.com/ben1522/ben-jones-one-on-one-meeting"
            target="_blank"
          >
            Schedule a review
          </Button>
        </div>
      </Alert>
    </div>
  )
}
