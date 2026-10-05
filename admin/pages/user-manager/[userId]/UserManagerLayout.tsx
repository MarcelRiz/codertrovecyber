import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as Icon from 'react-feather'
import DefaultLayout from '../../../src/layout/default'
import { Breadcrumb } from '../../../src/components'
import { useAppSelector, useAppDispatch } from '../../../src/states/hooks'
import {
  getUser,
  selectUserPofile,
} from '../../../src/states/features/userProfileSlice'

export const UserByIdContext = React.createContext({ user: null })

export default function UserManagerLayout({ children }) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectUserPofile)
  const router = useRouter()
  const goBack = () => {
    router.push('/user-manager')
  }
  const queryParms = router.query
  useEffect(() => {
    if (queryParms?.userId) {
      dispatch(getUser({ id: queryParms?.userId }))
    }
  }, [queryParms?.userId])

  return (
    <DefaultLayout>
      <Breadcrumb>
        <span className="breadcrumb-icon">
          <Icon.User />
        </span>
        <Link href="/user-manager">User Management</Link> /{' '}
        {user?.firstName || ''} {user?.lastName || ''}
      </Breadcrumb>
      <div className="page-container">
        <div className="row">
          <div className="col-12">
            <div className="card card-fluid justify-content-center">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h1 className="d-block h6 mb-0">
                      View User Details{' '}
                      {user?.blocked && (
                        <span className="user text-danger">
                          This user is blocked
                        </span>
                      )}
                    </h1>
                  </div>
                  <div className="col-auto">
                    <div
                      className="text-right link"
                      onClick={goBack}
                      aria-hidden="true"
                    >
                      <i className="fas fa-chevron-left"></i> Back
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body pt-1">
                <div className="row align-items-center">
                  <div className="col">
                    <ul className="nav nav-tabs overflow-x">
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname === '/user-manager/[userId]' &&
                            'active'
                          }`}
                          onClick={() =>
                            router.push(`/user-manager/${user?.id}`)
                          }
                        >
                          User Profile
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/company-details' &&
                            'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/company-details`
                            )
                          }
                        >
                          Company Details
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/company-staff' && 'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/company-staff`
                            )
                          }
                        >
                          Company Staff
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/action-center' && 'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/action-center`
                            )
                          }
                        >
                          Action Center
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/action-reports' &&
                            'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/action-reports`
                            )
                          }
                        >
                          Action Reports
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/security-academy' &&
                            'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/security-academy`
                            )
                          }
                        >
                          Security Academy
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/policy-centre' && 'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/policy-centre`
                            )
                          }
                        >
                          Policy Centre
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/security-audit' &&
                            'active'
                          }`}
                          onClick={() =>
                            router.push(
                              `/user-manager/${user?.id}/security-audit`
                            )
                          }
                        >
                          Security Audit
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          type="button"
                          className={`nav-link ${
                            router?.pathname ===
                              '/user-manager/[userId]/domain' && 'active'
                          }`}
                          onClick={() =>
                            router.push(`/user-manager/${user?.id}/domain`)
                          }
                        >
                          Domain
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="py-3">
                  <UserByIdContext.Provider value={{ user }}>
                    {children}
                  </UserByIdContext.Provider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
