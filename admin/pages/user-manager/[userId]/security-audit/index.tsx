import router from 'next/router'
import React from 'react'
import { selectUserPofile } from '../../../../src/states/features/userProfileSlice'
import { useAppSelector } from '../../../../src/states/hooks'
import UserManagerLayout from '../UserManagerLayout'

export default function SecurityAuditDetail() {
  const { user } = useAppSelector(selectUserPofile)
  return (
    <UserManagerLayout>
      <div className="row mx-n2">
        {
          user?.userQuestionGroups?.map(item => (
            <div className="col-lg-4 col-sm-12 px-2" key={item.id}>
              <div className="card card-fluid mb-0 pb-2">
                <div className="card-body text-center">
                  <div className="mb-2 h5">
                    <i className="fas fa-check-circle text-primary"></i>
                  </div>
                  <h5 className="h6 font-weight-bolder mb-1">{item.questionGroup?.name}</h5>
                  <span className="d-block text-md text-primary font-weight-bold link mt-2"
                    aria-hidden="true"
                    onClick={() => { router.push(`/user-manager/${user?.id}/security-audit/${item.typeformResponseId}`) }}>
                    View
                  </span>
                </div>
              </div>
            </div>
          ))
        }
        {user?.userQuestionGroups?.length === 0 && <p className="text-center mt-3 col-12">No Security Audit found</p>}
      </div>

    </UserManagerLayout>
  )
}