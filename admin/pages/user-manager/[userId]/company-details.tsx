import React, { useEffect } from 'react'
import {
  CompanyDetails
} from '../../../src/components/sections'
import { setCompany } from '../../../src/states/features/companySlice'
import { selectUserPofile } from '../../../src/states/features/userProfileSlice'
import { useAppDispatch, useAppSelector } from '../../../src/states/hooks'
import UserManagerLayout from './UserManagerLayout'

export default function CompanyDetailsPage() {  
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectUserPofile)
  useEffect(() => {
    if (user?.companies?.length > 0) {
      dispatch(setCompany(user?.companies[0]))
    }
  }, [user])
  return (
    <UserManagerLayout>      
      <CompanyDetails />
    </UserManagerLayout>
  )
}