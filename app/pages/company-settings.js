import React, { useState, useCallback, useEffect } from 'react'
import { Tab, Tabs, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import { me, updateProfile } from '@src/states/auth'
import DefaultLayout from '../src/layout/default'
import PageTitle from '../src/components/page-title'
import Main from '../src/components/main'
import FormCompanyDetails from '../src/components/form-company-details'
import StaffsList from '../src/components/staffs-list'
import withAuthenticated from '../src/hoc/withAuthenticated'
import withRole from '../src/hoc/withRole'
import { USER_ROLE } from '../src/constants'

const Tour = dynamic(() => import('reactour'), { ssr: false })
const companySettingGuideSteps = [
  {
    position: 'top',
    selector: '#staff-table',
    content: (
      <p>
        In this tab you are able to bulk or individually add your workforce to
        allow them access to the educational component of the platform as well
        as allocating your internal governance documentation.
        <br />
        <br />
        Additionally, you can then assign access to your staff so that they are
        receiving the appropriate content for them to elevate your security
        posture.
      </p>
    ),
  },
  {
    position: 'top',
    selector: '#threat_center_clone',
    content: '',
  },
]

function PageCompanySettings() {
  const [tabKey, setKey] = useState('company-details')
  const [open, setOpen] = useState(false)
  const user = useSelector(state => state.auth?.session?.user)
  const [guideStep, setGuideStep] = useState(0)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user?.isAckGuideTips) setKey('staffs')
  }, [user?.isAckGuideTips])

  useEffect(() => {
    if (tabKey === 'staffs' && !user.isAckGuideTips) setOpen(true)
  }, [tabKey, user?.isAckGuideTips])

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
    <DefaultLayout title="Company Settings" isHome={false} backLink="/">
      <PageTitle title="Company Settings" />
      <Main>
        <Tabs
          defaultActiveKey="company-details"
          activeKey={tabKey}
          onSelect={k => setKey(k)}
        >
          <Tab eventKey="company-details" title="Company details">
            <FormCompanyDetails />
          </Tab>
          <Tab eventKey="staffs" title="Staff" id="staffs">
            <StaffsList />
          </Tab>
        </Tabs>
      </Main>
      <CusTour
        steps={companySettingGuideSteps}
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
          if (guideStep === companySettingGuideSteps.length - 2) {
            router.push('/cyber-governance-centre')
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
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 15px;
    width: 0;
    height: 0;
    border-left: solid 15px transparent;
    border-right: solid 15px transparent;
    border-top: solid 10px white;
  }
`

export default withRole(
  withAuthenticated(PageCompanySettings),
  USER_ROLE.CLIENT
)
