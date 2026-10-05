/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Alert, Button, Col, Modal, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { me, updateProfile } from '@src/states/auth'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import DefaultLayout from '../src/layout/default'
import { USER_ROLE } from '../src/constants'
import withRole from '../src/hoc/withRole'
import withAuthenticated from '../src/hoc/withAuthenticated'
import Main from '../src/components/main'
import SecurityAuditItem from '../src/components/security-audit-item'

const Tour = dynamic(() => import('reactour'), { ssr: false })
const securityAuditGuideSteps = [
  {
    position: 'bottom',
    selector: '#question-groups',
    content:
      'Before we can identify the risks, your business may face, we need to perform an security audit. Simple put this is a list of questions that helps us understand your current practice and posture so that we can get a baseline for your business.',
  },
  {
    position: 'top',
    selector: '#dashboard',
    content:
      'Once we have completed this assessment you will be led to the Threat Centre which will list your risks and map them to best practice as set out by the international standards. This is a fundamental step in lifting up your posture and will give transparency on the issues we can solve together to reduce the risks profile all businesses face.',
  },
  {
    position: 'top',
    selector: '#dashboard',
    content:
      'Welcome to Governance. Here we will be establishing your Cyber manifesto for the organisation. We have created bespoke policies for your business that allow you to create best practice. We have also added in an acknowledgement system so that you have transparency on who in the organisation has read the policies which drives compliance and adoption.',
  },
]
function PageSecurityAudit() {
  const { questionGroups } = useSelector(state => state.actionItems)
  const user = useSelector(state => state.auth.session?.user)
  const companyUserQuestionGroups = user?.companyUserQuestionGroups
  const dispatch = useDispatch()
  const router = useRouter()
  const [guideStep, setGuideStep] = useState(0)
  const [open, setOpen] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setOpen(!user?.isAckGuideTips && user?.role?.name === USER_ROLE.CLIENT)
    if (user.isAckGuideTips) {
      setGuideStep(null)
    }
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

  const completedAll = useMemo(() => {
    let finished = true
    questionGroups?.forEach(item => {
      const find = companyUserQuestionGroups.find(
        qg => qg.questionGroup.id === item.id
      )
      if (!find) finished = false
    })
    return finished
  }, [companyUserQuestionGroups, questionGroups])

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [])

  const [showHelp, setShowHelp] = useState(false)
  return (
    <DefaultLayout isHome={false} title="Security Audit" backLink="/">
      <Main>
        <Row className="row-grid align-items-center">
          <Col xs={12} md={5} lg={6} className="order-md-2">
            <img
              alt="Security Audit"
              src={`${process.env.NEXT_PUBLIC_SECURITY_IMAGE_URL || ''}`}
              className="img-fluid"
            />
          </Col>
          <Col xs={12} md={7} lg={6} className="order-md-1">
            <h1 className="h1 text-center text-md-left mb-4">
              <strong className="text-highlight-info">Security Audit</strong>
            </h1>
            <p className="lead text-center text-md-left text-muted">
              Welcome to the Security Audit. These questions should take around
              10 mins to complete but it's important as we engage to enable us
              to understand the complexity of your environment and quickly
              assess where there maybe some gaps which can be exploited
            </p>
            <Button
              variant="primary"
              className="rounded-pill"
              onClick={() => setShowHelp(true)}
            >
              What is People, Process, Technology?
            </Button>
          </Col>
        </Row>

        <div id="question-groups" style={{ height: '350px' }}>
          <Row className="mt-5">
            {questionGroups.map(question => (
              <Col lg={4} md={6} key={question.id}>
                <SecurityAuditItem item={question} />
              </Col>
            ))}
          </Row>
        </div>

        {completedAll && (
          <div className="text-center">
            <Alert variant="success">
              <p>
                Congratulations, you have completed the Security Audit. Thanks
                for taking the time to share your details. Click below to go to
                the threat centre and review the outcome and we can get started
                together on the journey to Cyber resilience.
              </p>
              <Link href="/threat-centre">
                <Button className="rounded-pill">Go To Threat Centre</Button>
              </Link>
            </Alert>
          </div>
        )}

        <Modal size="xl" show={showHelp} onHide={() => setShowHelp(false)}>
          <Modal.Header closeButton>
            <Modal.Title>What is People, Process and Technology?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="embed-responsive embed-responsive-16by9">
              {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
              <iframe
                className="embed-responsive-item"
                src={`https://player.vimeo.com/video/${process.env.NEXT_PUBLIC_SECURITY_VIDEO_ID}`}
                width="640"
                height="564"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </Modal.Body>
        </Modal>
        <CusEnd ref={messagesEndRef} step={guideStep} />
      </Main>
      <CusTour
        steps={securityAuditGuideSteps}
        rounded={5}
        isOpen={open}
        className="my-helper"
        nextButton={
          <Button className="btn btn-neutral got-it-btn">Got it</Button>
        }
        showNumber={false}
        prevButton={<label />}
        goToStep={guideStep}
        disableDotsNavigation={false}
        showNavigation={false}
        nextStep={() => {
          if (guideStep === securityAuditGuideSteps.length - 2) {
            router.push('/mock-threat-centre')
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
  max-width: 600px !important;
  button {
    margin-left: 0 !important;
  }
  top: -112px;
  left: 25px;
  &::after {
    content: '';
    position: absolute;
    top: ${props => (props.goToStep === 0 ? '-4%' : '100%')};
    left: 12%;
    width: 0;
    height: 0;
    border-top: ${props =>
      props.goToStep === 0 ? 'unset' : 'solid 10px white'};
    border-left: solid 15px transparent;
    border-right: solid 15px transparent;
    border-bottom: ${props =>
      props.goToStep === 0 ? 'solid 10px white' : 'unset'};
  }
`

const CusEnd = styled.div`
  height: ${props => (props.step === 0 ? '200px' : '0px')};
`

export default withRole(withAuthenticated(PageSecurityAudit), USER_ROLE.CLIENT)
