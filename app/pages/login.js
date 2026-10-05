import React from 'react'
import FormLogin from '../src/components/form-login'
import LayoutGuest from '../src/layout/LayoutGuest'
import withUnauthenticated from '../src/hoc/withUnauthenticated'

function PageLogin() {
  return (
    <LayoutGuest>
      <FormLogin />
    </LayoutGuest>
  )
}

export default withUnauthenticated(PageLogin)
