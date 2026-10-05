import React, {useEffect} from 'react'
import { getCompanyById, selectCompany, resetData } from '../../../states/features/companySlice'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import { CardResult } from '../../shared'

export default function SecurityAcademy() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectUserPofile)
  const { companyById } = useAppSelector(selectCompany)
  useEffect(() => {
    if(user?.companies?.length > 0) {
      dispatch(getCompanyById(user.companies[0]))
    }    
    return () => {
      dispatch(resetData(''))
    }
  },[user])

  return (
    <>
      <h3>Security Academy</h3>
      <div className="card-body">
        <h5>Overral Staff Awareness</h5>
        <div className="row mx-n2">
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Course Completions" value={(companyById?.staffAwarenessTotal || 0) - (companyById?.staffAwarenessOutstanding || 0)} icon="fas fa-user-graduate" bg="bg-translucent-success" />
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Pending Completions" value={companyById?.staffAwarenessOutstanding || 0} icon="fas fa-exclamation-circle" bg="bg-translucent-warning" />
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Total Assignments" value={companyById?.staffAwarenessTotal || 0} icon="fas fa-book text-body" bg="bg-translucent-secondary" />
          </div>
        </div>
      </div>
    </>
  )
}