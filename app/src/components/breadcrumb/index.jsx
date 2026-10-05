import React from 'react'
import { Breadcrumb, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import { BreadcrumbStyled } from './buildInComponent.styled'

function BreadcrumbComponent({
  title = '',
  breakCrumbs = [],
  backgroundColor = '',
}) {
  return (
    <>
      <BreadcrumbStyled
        className="wrapBreadcrumb"
        backgroundColor={backgroundColor}
      >
        <Row className="pt-5">
          <Col>
            <Breadcrumb
              className="border-0 breadcrumb-light"
              listProps={{ className: 'border-0 px-0' }}
            >
              <Link href="/" passHref>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
              </Link>
              {breakCrumbs.length > 0 &&
                breakCrumbs.map(item => (
                  <Link href={item.url} passHref key={item.url}>
                    <Breadcrumb.Item>{item.text}</Breadcrumb.Item>
                  </Link>
                ))}
              <Breadcrumb.Item active>{title}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
      </BreadcrumbStyled>
    </>
  )
}

export default BreadcrumbComponent
