import React from 'react'
import LayoutGuest from '../src/layout/LayoutGuest'
import FormLoginOTP from '../src/components/form-login-otp'
import withUnauthenticated from '../src/hoc/withUnauthenticated'

function PageLoginOTP() {
  return (
    <LayoutGuest>
      <FormLoginOTP />
    </LayoutGuest>
  )
}

export default withUnauthenticated(PageLoginOTP)
