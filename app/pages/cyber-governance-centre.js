/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Col, Row, Tab, Tabs, Badge, Button } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { me, updateProfile } from '@src/states/auth'
import { Clipboard as IconClipboard, Check as IconCheck } from 'react-feather'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { toggleProfileModal } from '@src/states/common'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import CybersecurityPolicies from '../src/components/cybersecurity-policies'
import CompanyPolicies from '../src/components/company-policies'
import withAuthenticated from '../src/hoc/withAuthenticated'
import { getAllPolicies, getAssignedPolicies } from '../src/states/policies'
import Loading from '../src/components/loading'
import AppContext from '../src/contexts/app-context'
import { POLICY_TABS, USER_ROLE } from '../src/constants'

const Tour = dynamic(() => import('reactour'), { ssr: false })
const cyberGuideSteps = [
  {
    position: 'top',
    selector: '#cyber_governance_centre',
    content:
      'Welcome to Governance. Here we will be establishing your Cyber manifesto for the organisation. We have created bespoke policies for your business that allow you to create best practice. We have also added in an acknowledgement system so that you have transparency on who in the organisation has read the policies which drives compliance and adoption.',
  },
  {
    position: 'top',
    selector: '#generate_policy_set',
    content:
      'Here we can start on creating the documents you need with in the business. Once we reach out in person, we can take you on a test drive.',
  },
  {
    position: 'top',
    selector: '#change-password-btn',
    content:
      'Alright! So your first task in your security improvement progress is to update your default password here',
  },
  {
    position: 'top',
    selector: '#dashboard',
    content:
      'Welcome to Governance. Here we will be establishing your Cyber manifesto for the organisation. We have created bespoke policies for your business that allow you to create best practice. We have also added in an acknowledgement system so that you have transparency on who in the organisation has read the policies which drives compliance and adoption.',
  },
]

function PagePolicyCentre() {
  const { gettingPolicies, assignedPolicies } = useSelector(
    state => state.policies
  )
  const user = useSelector(state => state.auth?.session?.user)
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [guideStep, setGuideStep] = useState(0)
  const [open, setOpen] = useState(false)
  const { isClient } = useContext(AppContext)

  const router = useRouter()

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
          router.push('/')
        })
      },
    }).then(result => {
      if (result.isDismissed) {
        setOpen(true)
      }
    })
  }, [dispatch])

  useEffect(() => {
    setOpen(!user?.isAckGuideTips && user?.role?.name === USER_ROLE.CLIENT)
  }, [user?.isAckGuideTips])

  /**
   * if current user is client, then set default view to edit
   */
  useEffect(() => {
    setIsEditing(isClient)
  }, [isClient])

  /**
   * get all policies and all assigned items
   */
  const getPolicies = useCallback(() => {
    dispatch(getAllPolicies())
    dispatch(getAssignedPolicies())
  }, [dispatch])

  /**
   * on changing tab, set correct view
   * this is only for client
   * @type {(function(*): void)|*}
   */
  const onChangeTab = useCallback(eventKey => {
    setIsEditing(eventKey === POLICY_TABS.EDIT)
  }, [])

  const pendingAcknowledgePolicies = useMemo(
    () => assignedPolicies.filter(policy => !policy.isAcknowledged).length,
    [assignedPolicies]
  )

  /**
   * on load, get all policies
   */
  useEffect(() => {
    getPolicies()
  }, [getPolicies])

  return (
    <DefaultLayout title="Cyber Governance Centre" isHome={false} backLink="/">
      <PageTitle
        id="cyber_governance_centre"
        title="Cyber Governance Centre"
        subtitle={
          isClient
            ? 'Develop, define and publish your company’s Cyber Governance'
            : 'View, Read and Acknowledge company policies'
        }
      />

      <Main>
        <Row>
          <Col lg={12}>
            {gettingPolicies && (
              <div className="text-center mb-3">
                <Loading />
              </div>
            )}

            {isClient && (
              <Tabs
                defaultActiveKey={POLICY_TABS.EDIT}
                onSelect={onChangeTab}
                className="mb-3"
              >
                <Tab
                  title={
                    <div>
                      <>
                        <IconClipboard size={14} className="mr-2" />
                        Management
                      </>
                    </div>
                  }
                  eventKey={POLICY_TABS.EDIT}
                />
                <Tab
                  title={
                    <div>
                      <IconCheck size={14} className="mr-2" />
                      Acknowledgement
                      <Badge variant="success" className="ml-2">
                        {pendingAcknowledgePolicies}
                      </Badge>
                    </div>
                  }
                  eventKey={POLICY_TABS.VIEW}
                />
              </Tabs>
            )}

            <CybersecurityPolicies isEditing={isEditing} />

            <CompanyPolicies isEditing={isEditing} />

            {/* <ModalAcknowledgement /> */}
          </Col>
        </Row>
      </Main>
      <CusTour
        steps={cyberGuideSteps}
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
          if (guideStep === cyberGuideSteps.length - 2) {
            dispatch(
              updateProfile({
                isAckGuideTips: true,
                email: user.email,
                username: user.username,
              })
            ).then(() => {
              dispatch(me())
              router.push('/')
            })
          } else if (guideStep === cyberGuideSteps.length - 3) {
            dispatch(toggleProfileModal(true))
            setTimeout(() => {
              setGuideStep(guideStep + 1)
            }, 300)
          } else {
            setGuideStep(guideStep + 1)
          }
          // setGuideStep(guideStep + 1)
        }}
        onRequestClose={onCloseGuideTips}
      />
    </DefaultLayout>
  )
}

const CusTour = styled(Tour)`
  max-width: 500px !important;
  button {
    margin-left: 0 !important;
  }
  &::after {
    content: '';
    position: absolute;
    top: ${props => (props.goToStep === 2 ? '10%' : '100%')};
    left: ${props => (props.goToStep === 2 ? '100%' : '10%')};
    width: 0;
    height: 0;
    border-top: ${props =>
      props.goToStep === 2 ? 'solid 15px transparent' : 'solid 10px white'};
    border-left: ${props =>
      props.goToStep === 2 ? 'solid 10px white' : 'solid 15px transparent'};
    border-right: solid 15px transparent;
    border-bottom: ${props =>
      props.goToStep === 2 ? 'solid 15px transparent' : 'unset'};
  }
`

export default withAuthenticated(memo(PagePolicyCentre))
