import React, { useEffect } from 'react'
import Head from 'next/head'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import DefaultLayout from '../src/layout/default'
import { Breadcrumb } from '../src/components'
import {
  useAppDispatch,
  useAppSelector,
} from '../src/states/hooks'
import { getInfo, selectDashboard } from '../src/states/features/dashboardSlice'
import { CardResult, ProgressProvider } from '../src/components/shared'

export default function Home() {
  const dispatch = useAppDispatch()
  const {
    data
  } = useAppSelector(selectDashboard)

  useEffect(() => {
    dispatch(getInfo())
  }, [])
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
      </Head>
      <DefaultLayout>
        <>
          <Breadcrumb>
            <span className="breadcrumb-icon">
              <i className="fas fa-tachometer-alt"></i>
            </span>
            Home
          </Breadcrumb>
          <div className='page-container'>
            <div className="row mx-n2 mt-3">
              <div className="col-xl-3 col-lg-6 col-sm-12 px-2">
                <CardResult label="Total clients" value={data?.totalClients || 0} icon="fas fa-users" bg="bg-light-primary" />
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-12 px-2">
                <CardResult label="Total staff" value={data?.totalStaffs || 0} icon="fas fa-user-friends" bg="bg-light-danger" />
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-12 px-2">
                <CardResult label="Total courses" value={data?.totalCourses || 0} icon="fas fa-user-graduate" bg="bg-light-warning" />
              </div>
              <div className="col-xl-3 col-lg-6 col-sm-12 px-2">
                <CardResult label="Total Cybersecurity Policies" value={data?.totalCyberSecurityPolicies || 0} icon="fas fa-industry" bg="bg-light-success" />
              </div>
            </div>
            <div className="row mx-n2">
              <div className="col-lg-6 col-md-12 px-2">
                <div className="card card-fluid justify-content-center mb-0 pb-4">
                  <div className="card-body text-center">
                    <h3 className="text-center mb-3">Average Customer <br /> Security Rating</h3>
                    <div className="dashboard-rating mt-5 mb-3">
                      <ProgressProvider valueStart={0} valueEnd={data?.avgCompanySecurityRating || 0} >
                        {value => <CircularProgressbar value={value} text={`${value}%`} styles={buildStyles({
                          textSize: '16px',
                          textColor: '#4615d6',
                          pathColor: 'rgba(0, 13, 255, 0.6)'
                        })} />}
                      </ProgressProvider>
                    </div>                    
                  </div>
                </div>
              </div>
              <div className="col-lg-6  col-md-12 px-2">
                <div className="card card-fluid justify-content-center pb-4 mb-0">
                  <div className="card-body text-center">
                    <h3 className="text-center mb-3">Overall Status</h3>
                    <div className="mx-n2 row">
                      <div className="px-2 col-lg-4">
                        <div className="dashboard-rating mb-3">
                          <h5 className="text-center mb-3">Knowledge and Education</h5>
                          <ProgressProvider valueStart={0} valueEnd={data?.knowledgeCompleted || 0} >
                            {value => <CircularProgressbar value={value} text={`${value}%`} styles={buildStyles({
                              textSize: '16px',
                              pathTransitionDuration: 0.5,
                              textColor: '#f25767',
                              pathColor: 'rgba(242, 87, 103, 1)'
                            })} />}
                          </ProgressProvider>
                        </div>
                        <div className="d-flex justify-content-between px-2"><span className="text-muted">Outstanding</span><strong className="ml-3 text-warning">{data?.knowledgeOutstanding}</strong></div>
                        <div className="d-flex justify-content-between  px-2"><span className="text-muted">Total</span><strong className="ml-3">{data?.knowledgeTotal}</strong></div>
                      </div>
                      <div className="px-2 col-lg-4">
                        <div className="dashboard-rating mb-3">
                          <h5 className="text-center mb-3">Policies and Procedures</h5>
                          <ProgressProvider valueStart={0} valueEnd={data?.completedPolicies || 0} >
                            {value => <CircularProgressbar value={value} text={`${value}%`} styles={buildStyles({
                              textSize: '16px',
                              pathTransitionDuration: 0.5,
                              textColor: '#ffbe3d',
                              pathColor: 'rgba(255, 190, 61 , 1)'
                            })} />}
                          </ProgressProvider>
                        </div>
                        <div className="d-flex justify-content-between  px-2"><span className="text-muted">Outstanding</span><strong className="ml-3 text-warning">{data?.outstandingPolicies}</strong></div>
                        <div className="d-flex justify-content-between  px-2"><span className="text-muted">Total</span><strong className="ml-3">{data?.totalPolicies}</strong></div>
                      </div>
                      <div className="px-2 col-lg-4">
                        <div className="dashboard-rating mb-3">
                          <h5 className="text-center mb-3">Actions and Implementations</h5>
                          <ProgressProvider valueStart={0} valueEnd={data?.completedUserActionItem || 0} >
                            {value => <CircularProgressbar value={value} text={`${value}%`} styles={buildStyles({
                              textSize: '16px',
                              pathTransitionDuration: 0.5,
                              textColor: '#50b5ff',
                              pathColor: 'rgba(80, 181, 255 , 1)'
                            })} />}
                          </ProgressProvider>
                        </div>
                        <div className="d-flex justify-content-between  px-2"><span className="text-muted">Outstanding</span><strong className="ml-3 text-warning">{data?.outstandingUserActionItem}</strong></div>
                        <div className="d-flex justify-content-between  px-2"><span className="text-muted">Total</span><strong className="ml-3">{data?.totalUserActionItem}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </DefaultLayout>
    </>
  )
}
