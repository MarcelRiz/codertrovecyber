import React from 'react'
import LayoutGuest from '../src/layout/LayoutGuest'
import SignUpComponent from '../src/components/sign-up'
import withUnauthenticated from '../src/hoc/withUnauthenticated'

function PageSignUp() {
  return (
    <LayoutGuest>
      <SignUpComponent />
    </LayoutGuest>
  )
}

export default withUnauthenticated(PageSignUp)
