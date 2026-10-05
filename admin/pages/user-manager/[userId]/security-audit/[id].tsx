import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import * as Icon from 'react-feather'
import { Breadcrumb } from '../../../../src/components'
import DefaultLayout from '../../../../src/layout/default'
import { questionGroups, selectSecurityAcademy } from '../../../../src/states/features/securityAcademySlice'
import { getUser, selectUserPofile } from '../../../../src/states/features/userProfileSlice'
import { useAppDispatch, useAppSelector } from '../../../../src/states/hooks'

export default function SecurityAuditDetail() {
  const { user } = useAppSelector(selectUserPofile)
  const { securityAcademy, pending } = useAppSelector(selectSecurityAcademy)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryParms = router.query
  const [userQuestionGroup, setUserQuestionGroup] = useState({ questionGroup: null })
  useEffect(() => {
    if (queryParms?.userId) {
      dispatch(getUser({ id: queryParms?.userId }))
    }
  }, [queryParms?.userId])

  useEffect(() => {
    if (queryParms?.id) {
      if (user?.userQuestionGroups) {
        const question = user?.userQuestionGroups?.filter(item => item?.typeformResponseId === queryParms?.id)
        setUserQuestionGroup(question[0])
        dispatch(questionGroups({ responseId: queryParms?.id, groupId: question[0]?.questionGroup?.id }))
      }
    }
  }, [user, queryParms?.id])

  return (
    <DefaultLayout>
      <Breadcrumb>
        <span className="breadcrumb-icon">
          <Icon.User />
        </span>
        <Link href="/user-manager">User Management</Link> / {user?.firstName || ''} {user?.lastName || ''}
      </Breadcrumb>
      <div className='page-container'>
        <div className="row">
          <div className="col-12">
            <div className="card card-fluid justify-content-center">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h1 className="d-block h6 mb-0">{userQuestionGroup?.questionGroup?.name} Details {user?.blocked && <span className="user text-danger">This user is blocked</span>}</h1>
                  </div>
                  <div className="col-auto">
                    <div className="text-right link" onClick={() => { router.back() }} aria-hidden="true">
                      <i className="fas fa-chevron-left"></i> Back
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-1">
                <div className="py-3">
                  <div className="table-responsive">
                    <table className="table align-items-center">
                      <thead>
                        <tr>
                          <th scope="col">&nbsp;</th>
                          <th scope="col">
                            Question
                          </th>
                          <th scope="col">
                            Answer
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          !pending && securityAcademy.map((item, index) => (
                            <tr key={item.id}>
                              <td style={{ width: 30 }}>{index + 1}</td>
                              <td style={{ width: '55%' }}>
                                <span className="client">{item?.title}</span>
                              </td>
                              <td className="order" style={{ width: '40%' }}>
                                {item[item.type]?.label || ''}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                    {pending &&
                      <p className="text-center mt-3">
                        <Spinner animation="border" variant="primary" size="sm" />
                        <span className="pt-1 d-inline-block align-middle ml-2">loading data...</span>
                      </p>}
                    {securityAcademy.length === 0 && !pending && <p className="text-center mt-3">No Security Audit found</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>

  )
}