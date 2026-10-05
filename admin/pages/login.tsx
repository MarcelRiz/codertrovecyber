import React from 'react'
import { Button } from 'react-bootstrap'
import { signIn } from 'next-auth/client'

export default function Login() {
  return (
    <div className="d-flex flex-column container-fluid" style={{
      background: 'url(/images/backgrounds/img-3.jpg)',
    }}>
      <div className='row align-items-center justify-content-center min-vh-100'>
        <div className="mx-auto col-xl-4 col-lg-5 col-md-6 py-6 py-md-0 text-center">
          <div className="shadow-lg border-0 mb-0 card">
            <div className="py-5 px-sm-5 card-body">
              <div className="mb-5 text-center">
                <h6 className="h3 mb-1">Login</h6>
                <p className="text-muted mb-0">Sign in to your account to continue.</p>
              </div>
              <span className="clearfix" />
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  signIn('google')
                }}
              >
                Log In via Google SSO
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}