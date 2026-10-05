import React, { useCallback, useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import moment from 'moment'

export default function ReportsList({ reportType }) {
  const { reports } = useSelector(state => state.reports)

  /**
   * query reports
   */
  const filteredReports = useMemo(() => {
    const filtered = reports.filter(
      item => item.reportType.id === reportType.id
    )
    return filtered.sort((a, b) => {
      const dayA = moment(a.updated_at)
      const dayB = moment(b.updated_at)

      return dayB.diff(dayA)
    })
  }, [reportType, reports])

  const [open, setOpen] = useState(false)

  /**
   * download report
   * @type {(function(*): void)|*}
   */
  const downloadReport = useCallback(report => {
    const url = `${process.env.NEXT_PUBLIC_API}${report.pdf.url}`
    window.open(url, '_blank')
  }, [])

  /**
   * get latest report date
   * @type {string}
   */
  const latestReportDate = useMemo(
    () => moment(filteredReports[0]?.updated_at).format('MMMM DD, YYYY'),
    [filteredReports]
  )

  /**
   * format date of report
   * @type {function(*): string}
   */
  const formatDate = useCallback(
    report => moment(report.updated_at).format('MMMM DD, YYYY'),
    []
  )

  return (
    <>
      <Card className="mb-3 hover-shadow-lg" id={`report_${reportType.index}`}>
        <Card.Body
          className="py-3 d-flex flex-wrap flex-md-nowrap"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setOpen(!open)
          }}
        >
          <Col md={9}>
            {reportType?.name}
            {filteredReports.length > 0 && (
              <Badge variant="light" className="ml-2">
                {filteredReports.length}
              </Badge>
            )}
          </Col>
          <Col md={3} className="text-lg-right">
            {filteredReports.length > 0 && latestReportDate}
          </Col>
        </Card.Body>
        {open && (
          <Card.Body className="bg-light">
            {filteredReports.length > 0 && (
              <h5 className="text-muted">
                Last report published: {latestReportDate}
              </h5>
            )}
            <p>{reportType?.description}</p>
            <Table bordered striped hover className="bg-white">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.name}>
                    <td>
                      <b>{report.name}</b>
                    </td>
                    <td>{formatDate(report)}</td>
                    <td>
                      <Button
                        variant="neutral"
                        size="xs"
                        onClick={() => {
                          downloadReport(report)
                        }}
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        )}
      </Card>
    </>
  )
}
