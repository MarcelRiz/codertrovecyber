/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react'
import { Badge, Tab, Tabs, Button } from 'react-bootstrap'
import { List as IconList, File as IconFile } from 'react-feather'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'
import { me, updateProfile } from '@src/states/auth'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import ActionItems from '../src/components/mock-action-items'
import Reports from '../src/components/reports'
import withAuthenticated from '../src/hoc/withAuthenticated'
import withRole from '../src/hoc/withRole'
import { ACTION_ITEM_STATE, USER_ROLE } from '../src/constants'
import { DUMMY_THREAT_DATA } from '../src/constants/threatData'

import BannerScheduleMeeting from '../src/components/banner-schedule-meeting'

const Tour = dynamic(() => import('reactour'), { ssr: false })
const threatGuideSteps = [
  {
    position: 'top',
    selector: '#threat_center_clone',
    content:
      'So, we have completed the Threat assessment and here are the areas of focus for us to lift your Cyber resilience. We have created pending items for your organisation and tied each issue to best practice.',
  },
  {
    position: 'top',
    selector: '#theats_items_table tbody tr:nth-child(1)',
    content:
      'This is a comprehensive list and explanation of each of the threats we have identified. We also explain in detail why it’s important for you to remediate this issue ASAP.',
  },
  {
    position: 'bottom',
    selector: '#theats_eliminated_table tbody tr:nth-child(1)',
    content:
      'Here we have also compiled the data on the issue you have already remediated for reporting purposes back to your business.',
  },
  {
    position: 'bottom',
    selector: '#report_0',
    content:
      'He we house supplementary reports that we generate on your behalf including a Dark web scrape and a vulnerability assessment on your internet facing architecture. This helps us find any other threats that maybe publicly facing which in turn can be exploited by the bad guys.',
  },
  {
    position: 'top',
    selector: '#schedule_review',
    content:
      'Hit this button to organise a call with our experts to help out with any issues that you may face. These calls occur on a monthly basis on your subscription.',
  },
  {
    position: 'top',
    selector: '#threat_center_clone',
    content: '',
  },
]

function PageActionCentre() {
  const { reports } = useSelector(state => state.reports)
  const user = useSelector(state => state.auth?.session?.user)

  const [guideStep, setGuideStep] = useState(0)
  const [tabKey, setKey] = useState('action-items')
  const [open, setOpen] = useState(false)
  const companyUserActionItems = DUMMY_THREAT_DATA
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    setOpen(!user?.isAckGuideTips && user?.role?.name === USER_ROLE.CLIENT)
  }, [user?.isAckGuideTips])

  useEffect(() => {
    if (user?.isAckGuideTips) {
      router.push('/')
    }
  }, [router, user?.isAckGuideTips])

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

  return (
    <DefaultLayout
      title="Threat Centre"
      isHome={false}
      id="threat_center_clone"
      backLink="/"
    >
      <PageTitle title="Threat Centre" />

      <Main>
        <Tabs
          defaultActiveKey="action-items"
          activeKey={tabKey}
          onSelect={k => setKey(k)}
          className="mb-3"
        >
          <Tab
            eventKey="action-items"
            title={
              <div id="threat_items">
                <IconList size={14} className="mr-2" />
                Threat Items{' '}
                <Badge className="ml-2" variant="danger">
                  {
                    companyUserActionItems?.filter(
                      item => item.state === ACTION_ITEM_STATE.UNRESOLVED
                    ).length
                  }
                </Badge>
              </div>
            }
          >
            <BannerScheduleMeeting />
            <ActionItems unresolved />
          </Tab>
          <Tab
            eventKey="threatsEliminated"
            title={
              <div id="theats_eliminated">
                <IconList size={14} className="mr-2" />
                Threats Eliminated{' '}
                <Badge className="ml-2" variant="success">
                  {
                    companyUserActionItems?.filter(
                      item => item.state !== ACTION_ITEM_STATE.UNRESOLVED
                    ).length
                  }
                </Badge>
              </div>
            }
          >
            <ActionItems unresolved={false} />
          </Tab>
          <Tab
            eventKey="reports"
            title={
              <div id="threats_reports">
                <IconFile size={14} className="mr-2" />
                Reports{' '}
                {reports.length > 0 && (
                  <Badge className="ml-2" variant="success">
                    {reports.length}
                  </Badge>
                )}
              </div>
            }
          >
            <Reports />
          </Tab>
        </Tabs>
      </Main>
      <CusTour
        steps={threatGuideSteps}
        rounded={5}
        isOpen={open}
        className="my-helper"
        nextButton={
          <Button className="btn btn-neutral got-it-btn">Got it</Button>
        }
        showNumber={false}
        goToStep={guideStep}
        prevButton={<></>}
        disableDotsNavigation={false}
        showNavigation={false}
        closeWithMask={false}
        nextStep={() => {
          if (guideStep === 1) {
            setKey('threatsEliminated')
          } else if (guideStep === 2) {
            setKey('reports')
          } else if (guideStep === 3) {
            setKey('action-items')
          }
          if (guideStep === threatGuideSteps.length - 2) {
            router.push('/company-settings')
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
  max-width: 500px !important;
  button {
    margin-left: 0 !important;
  }
  &::after {
    content: '';
    position: absolute;
    top: ${props =>
      props.goToStep === 2 ? '-5%' : props.goToStep === 3 ? '-4%' : '100%'};
    left: 10%;
    width: 0;
    height: 0;
    border-top: ${props =>
      [2, 3].includes(props.goToStep) ? 'unset' : 'solid 10px white'};
    border-left: solid 15px transparent;
    border-right: solid 15px transparent;
    border-bottom: ${props =>
      [2, 3].includes(props.goToStep) ? 'solid 10px white' : 'unset'};
  }
`

export default withRole(withAuthenticated(PageActionCentre), USER_ROLE.CLIENT)
