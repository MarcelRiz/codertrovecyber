/* eslint-disable no-useless-escape */
/* eslint-disable no-shadow */
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { Col, Modal, Row, Button } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { me, updateProfile } from '@src/states/auth'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { USER_ROLE } from '@src/constants'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import OverallSecurityRating from '../src/components/overall-security-rating'
import StepToSecure from '../src/components/step-to-secure'
import DashboardCyberPolicies from '../src/components/dashboard-cyber-policies'
import DashboardCyberTraining from '../src/components/dashboard-cyber-tranining'
import withAuthenticated from '../src/hoc/withAuthenticated'
import TypeformAssessment from '../src/components/typeform-assessment'
import Loading from '../src/components/loading'
import YourCoursesBadges from '../src/components/your-courses-badges'
import AppContext from '../src/contexts/app-context'

const YourOverallStatus = dynamic(
  () => import('../src/components/your-overall-status'),
  { ssr: false }
)

const OverallStatus = dynamic(
  () => import('../src/components/overall-status'),
  { ssr: false }
)

const Tour = dynamic(() => import('reactour'), { ssr: false })
const dashboardGuideSteps = [
  {
    selector: '#dashboard',
    content: `Welcome to ${process.env.NEXT_PUBLIC_TITLE}, your one stop shop to help you create cyber resilience in your business. Let\'s get started`,
    position: 'top',
  },
  {
    position: 'top',
    selector: '#dashboard',
    content:
      'Welcome home, this dashboard gives you access to our insights. Here you can find a top-level look at your organisations Cyber posture as well as how you are going on your people, your process, and your technology',
  },
  {
    position: 'top',
    selector: '#industry_benchmarking',
    content:
      'This tab highlights the average Cyber score for your particular industry across thousands of businesses.',
  },
  {
    position: 'top',
    selector: '#company_rating',
    content:
      'Company rating rates your business currently against the threat assessment we have conducted. As we progress the program, we will see this number improve and hopefully surpass the industry benchmark above.',
  },
  {
    position: 'top',
    selector: '#people_rating',
    content:
      'People rating looks at how your business is tracking with the educational component on platform, how many people have been enrolled and have completed their training.',
  },
  {
    position: 'top',
    selector: '#process_rating',
    content:
      'Process rating looks implicitly at your cyber governance. This score provides insights into how many people have engaged with your cyber strategy documents, who has read and acknowledged them which allows your organisation to all be on the same page with your vision.',
  },
  {
    position: 'top',
    selector: '#technology_rating',
    content:
      'After we have completed a review of your technology through our risk assessment, we will have identified the gaps in best practice and therefore allocate a score against your responses.  Having then identified the gaps we work together to patch these gaps and uplift your Cyber posture.',
  },
  {
    position: 'top',
    selector: '#cis_rating',
    content:
      'This is your rating against international standards. We are always working towards best practice, and this allows us insights into how you are placed in regard to what great looks like.',
  },
  {
    position: 'top',
    selector: '#knowlegde_edu',
    content:
      'An indication of how the progression of the educational is going for your teams.',
  },
  {
    position: 'top',
    selector: '#polies_procedures',
    content:
      'How many of the policies that form the governance framework of your organisation have been read and acknowledged.',
  },
  {
    position: 'top',
    selector: '#actions_implementation',
    content:
      'Through our technical assessment we have identified threats that need to be remediated, this tab highlights your progression on the remediation activities.',
  },
  {
    position: 'top',
    selector: '.react-card-flip',
    content:
      'This gives a member of your staff an instant real time lens into how much of the education they have completed to be compliant to your new Cyber governance. It also allows the end user to see how many of the policies they have read and acknowledged so that they are in line with your new Cyber framework. This helps keep everyone on point on the journey to cyber resilience.',
  },
  {
    position: 'top',
    selector: '#dashboard',
    content: '',
  },
]
function Home() {
  const [open, setOpen] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [isOverallStatusFlipped, setOverallStatusFlipped] = useState(false)
  const user = useSelector(state => state.auth?.session?.user)
  const { submittingAssessment } = useSelector(state => state.actionItems)
  const { isClient } = useContext(AppContext)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    setOpen(!user?.isAckGuideTips && user?.role?.name === USER_ROLE.CLIENT)
  }, [user?.isAckGuideTips])

  const onCloseGuideTips = useCallback(() => {
    setOpen(false)
    Swal.fire({
      icon: 'question',
      title: 'Are you sure you want to exit the guide tour?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      preConfirm() {
        dispatch(
          updateProfile({
            isAckGuideTips: true,
            email: user.email,
            username: user.username,
          })
        ).then(() => {
          dispatch(me())
        })
      },
    }).then(result => {
      if (result.isDismissed) {
        setOpen(true)
      }
    })
  }, [dispatch])

  const onOverallStatusChange = useCallback(() => {
    setOverallStatusFlipped(prev => !prev)
  }, [])

  return (
    <DefaultLayout title="Dashboard">
      <PageTitle
        id="dashboard"
        title="Cybersecurity Dashboard"
        subtitle={
          <div id="welcome">
            Welcome back, <b>{user?.firstName || user?.email}</b>!
          </div>
        }
      />
      <Main>
        {isClient && (
          <Row>
            <Col lg={4}>
              <OverallSecurityRating />
            </Col>
            <Col lg={8}>
              <OverallStatus
                isFlipped={isOverallStatusFlipped}
                onOverallStatusChange={onOverallStatusChange}
              />
            </Col>
          </Row>
        )}

        {!isClient && (
          <Row>
            <Col lg={8}>
              <YourOverallStatus />
            </Col>
            <Col lg={4}>
              <YourCoursesBadges />
            </Col>
          </Row>
        )}

        <Row>
          {isClient && (
            <Col lg={4}>
              <StepToSecure />
            </Col>
          )}
          <Col lg={4}>
            <DashboardCyberPolicies />
          </Col>
          <Col lg={4}>
            <DashboardCyberTraining />
          </Col>
        </Row>
      </Main>

      <TypeformAssessment />

      {submittingAssessment && (
        <Modal show backdrop="static">
          <Modal.Header>
            <Modal.Title>Assessment in progress</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <Loading />
            </div>
            <div>
              Your assessment is being processed. Please wait for a while...
            </div>
          </Modal.Body>
        </Modal>
      )}
      <CusTour
        steps={dashboardGuideSteps}
        rounded={5}
        isOpen={open}
        className="helper"
        nextButton={
          <Button className="btn btn-neutral got-it-btn">Got it</Button>
        }
        showNumber={false}
        goToStep={guideStep}
        prevButton={<></>}
        disableDotsNavigation={false}
        showNavigation={false}
        showArrow
        closeWithMask={false}
        nextStep={() => {
          if (guideStep === dashboardGuideSteps.length - 2) {
            router.push('/security-audit')
          } else if (guideStep === dashboardGuideSteps.length - 3) {
            setOverallStatusFlipped(true)
            setTimeout(() => {
              setGuideStep(guideStep + 1)
            }, 300)
          } else {
            setGuideStep(guideStep + 1)
          }
        }}
        onRequestClose={onCloseGuideTips}
      />
    </DefaultLayout>
  )
}

const CusTour = styled(Tour)`
  & {
    max-width: 500px !important;
    button {
      margin-left: 0 !important;
    }
  }
  &::after {
    content: '';
    position: absolute;
    top: ${props => (props.goToStep === 11 ? '10%' : '100%')};
    left: ${props => (props.goToStep === 11 ? '100%' : '10%')};
    width: 0;
    height: 0;
    border-top: ${props =>
      props.goToStep === 11 ? 'solid 15px transparent' : 'solid 10px white'};
    border-bottom: ${props =>
      props.goToStep === 11 ? 'solid 15px transparent' : 'unset'};
    border-left: ${props =>
      props.goToStep === 11 ? 'solid 10px white' : 'solid 15px transparent'};
    border-right: ${props =>
      props.goToStep === 11 ? 'unset' : 'solid 15px transparent'};
  }
`

export default withAuthenticated(Home)
