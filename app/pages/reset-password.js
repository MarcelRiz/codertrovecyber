import React from 'react'
import LayoutGuest from '../src/layout/LayoutGuest'
import FormResetPassword from '../src/components/form-reset-password'
import withUnauthenticated from '../src/hoc/withUnauthenticated'

function PageForgotPassword() {
  return (
    <LayoutGuest>
      <FormResetPassword />
    </LayoutGuest>
  )
}

export default withUnauthenticated(PageForgotPassword)
