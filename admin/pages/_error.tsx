import React from 'react'
import Link from 'next/link'
import { ArrowLeft as IconArrowLeft, Home as IconHome } from 'react-feather'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

function Error({ statusCode }) {
  return (
    <>
      <OverlayTrigger
        trigger="hover"
        placement="right"
        overlay={<Tooltip id="tooltip">Go back</Tooltip>}
      >
        <Link href="/" passHref>
          <Button className="btn btn-neutral btn-icon-only rounded-circle position-absolute left-4 top-4 d-none d-lg-inline-flex">
            <span className="btn-inner--icon">
              <IconArrowLeft />
            </span>
          </Button>
        </Link>
      </OverlayTrigger>
      <section>
        <div className="container d-flex flex-column">
          <div className="row align-items-center justify-content-between min-vh-100">
            <div className="col-12 col-md-6 col-xl-7 order-md-2">
              <img
                alt="Error found!"
                src="/images/svg/illustrations/illustration-13.svg"
                className="img-fluid"
              />
            </div>
            <div className="col-12 col-md-6 col-xl-5 order-md-1 text-center text-md-left">
              <h6 className="display-1 mb-3 font-weight-600 text-warning">
                Ooops!
              </h6>

              <p className="lead text-lg mb-5">
                {statusCode
                  ? `An error ${statusCode} occurred on server`
                  : 'An error occurred on client'}
              </p>

              <Link href="/">
                <Button
                  variant="dark"
                  className="btn-icon hover-translate-y-n3"
                >
                  <span className="btn-inner--icon">
                    <IconHome />
                  </span>
                  <span className="btn-inner--text">Return home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res.statusCode && err ? err.statusCode : 404
  return { statusCode }
}

export default Error