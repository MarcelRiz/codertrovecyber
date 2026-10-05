import React from 'react'
import LayoutGuest from '../src/layout/LayoutGuest'
import FormForgotPassword from '../src/components/form-forgot-password'
import withUnauthenticated from '../src/hoc/withUnauthenticated'

function PageForgotPassword() {
  return (
    <LayoutGuest>
      <FormForgotPassword />
    </LayoutGuest>
  )
}

export default withUnauthenticated(PageForgotPassword)
