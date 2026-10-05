import React, { useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Breadcrumb, Container, Button, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import Header from '../components/header'
import ModalProfile from '../components/modal-profile'
import ModalEditProfile from '../components/modal-edit-profile'
import ModalChangePassword from '../components/modal-change-password'
import ModalChangeSupportCentre from '../components/modal-change-support-centre'
import ModalChangeAssistanceRequest from '../components/modal-change-assistance-request'

export default function DefaultLayout({
  children,
  title,
  isHome = true,
  breadcrumbs = [],
  backLink = null,
}) {
  const router = useRouter()

  const onPageBack = useCallback(
    breadcrumbLink => {
      if (backLink) {
        router.push(backLink)
      }
      if (breadcrumbLink) {
        router.push(breadcrumbLink)
      } else {
        router.back()
      }
    },
    [backLink]
  )

  return (
    <div className="main-wrapper">
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_TITLE} - {title}
        </title>
        <meta
          name="title"
          content={`${process.env.NEXT_PUBLIC_TITLE} - ${title}`}
        />
      </Head>

      <Header />

      <ModalProfile />
      <ModalEditProfile />
      <ModalChangePassword />
      <ModalChangeSupportCentre />
      <ModalChangeAssistanceRequest />

      <div className="min-vh-100 bg-section-secondary">
        {!isHome && !breadcrumbs.length && (
          <Container className="pt-5">
            <Row>
              <Col>
                <Breadcrumb
                  className="border-0 breadcrumb-light"
                  listProps={{ className: 'border-0 px-0' }}
                >
                  <Link href="/" passHref>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                  </Link>
                  {breadcrumbs?.map(item => (
                    <Link href={item.url} passHref key={item.url}>
                      <Breadcrumb.Item>{item.text}</Breadcrumb.Item>
                    </Link>
                  ))}
                  <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col>
                <Button
                  className="float-right text-scotpac-secondary"
                  variant="link"
                  onClick={onPageBack}
                >
                  Back
                </Button>
              </Col>
            </Row>
          </Container>
        )}
        {!isHome && (
          <Container className="pt-5">
            {breadcrumbs.length > 0 &&
              breadcrumbs?.map(item => (
                <Row key={`breadcrumbs_${item.text}`}>
                  <Col>
                    <Breadcrumb
                      className="border-0 breadcrumb-light"
                      listProps={{ className: 'border-0 px-0' }}
                    >
                      <Link href="/" passHref>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                      </Link>
                      <Link href={item.url} passHref key={item.url}>
                        <Breadcrumb.Item>{item.text}</Breadcrumb.Item>
                      </Link>
                      <Breadcrumb.Item active>{title}</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                  <Col>
                    <Button
                      className="float-right text-scotpac-secondary"
                      variant="link"
                      onClick={() => onPageBack(item?.url || '/')}
                    >
                      Back
                    </Button>
                  </Col>
                </Row>
              ))}
          </Container>
        )}

        {children}
      </div>

      <footer className="d-flex align-items-center justify-content-center p-3 bg-section-secondary">
        <div className="text-muted text-sm">
          {process.env.NEXT_PUBLIC_TITLE} &copy; {new Date().getFullYear()}. All
          Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
