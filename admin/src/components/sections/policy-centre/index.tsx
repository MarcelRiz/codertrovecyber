import React, {useEffect} from 'react'
import { getCompanyById, resetData, selectCompany } from '../../../states/features/companySlice'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import { CardResult } from '../../shared'

export default function PolicyCentre() {
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
      <h3>Policy Centre</h3>
      <div className="card-body">
        <h5>Overral Policy Status</h5>
        <div className="row mx-n2">
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Policy Acknowledgements" value={companyById?.policyAcknowledged || 0} icon="far fa-snowflake" bg="bg-translucent-success" />            
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Pending Acknowledgements" value={companyById?.policyOutstanding || 0} icon="fab fa-think-peaks" bg="bg-translucent-warning" />
          </div>
          <div className="col-lg-4 col-sm-12 px-2">
            <CardResult label="Total Company Policies" value={companyById?.policyTotal || 0} icon="fas fa-award text-body" bg="bg-translucent-secondary" />            
          </div>
        </div>
      </div>
    </>
  )
}