import React, { useContext } from 'react'
import { Alert, Col, Row } from 'react-bootstrap'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import SecurityCourses from '../src/components/security-courses'
import withAuthenticated from '../src/hoc/withAuthenticated'
import AppContext from '../src/contexts/app-context'

function PageSecurityAcademy() {
  const { isClient } = useContext(AppContext)

  const AlertBlock = () => (
    <Alert variant="scotpac-secondary">
      <Alert.Heading>We're always adding new content</Alert.Heading>
      <p>Keep checking back for new awareness videos and courses.</p>
    </Alert>
  )

  return (
    <DefaultLayout title="Education Centre" isHome={false} backLink="/">
      <PageTitle
        title="Education Centre"
        subtitle={
          isClient
            ? 'Uplift your peoples security awareness through engaging content to elevate your staff to be the first line of defence'
            : 'Improve your awareness of cybersecurity threats.'
        }
      />

      <Main>
        <Row>
          <Col lg={12}>
            <SecurityCourses />
            <div className="d-block d-lg-none">
              <AlertBlock />
            </div>
          </Col>
        </Row>
      </Main>
    </DefaultLayout>
  )
}

export default withAuthenticated(PageSecurityAcademy)
