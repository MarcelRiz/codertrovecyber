import React, { useMemo } from 'react'
import { Container, Navbar } from 'react-bootstrap'
import Link from 'next/link'
/* import {
  X as IconX,
  Settings as IconSettings,
  User as IconUser,
  Headphones as IconHeadphones,
  Home as IconHome,
  // List as IconList,
  // ShoppingBag as IconShoppingBag,
  // Book as IconBook,
  // Shield as IconShield,
} from 'react-feather' */
import { useDispatch, useSelector } from 'react-redux'

// import styles from './styles.module.scss'
import { toggleProfileModal } from '../../states/common'

const { NEXT_PUBLIC_TENANT } = process.env

export default function Header() {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.auth?.session?.user)

  /**
   * display short name
   * @type {unknown}
   */
  const shortName = useMemo(() => {
    if (!user) return null
    if (user?.firstName && user?.lastName) {
      return `${user?.firstName[0]}${user?.lastName[0]}`.toUpperCase()
    }
    return user?.email[0]?.toUpperCase()
  }, [user])

  /**
   * get logo url
   * @type {unknown}
   */
  const logoUrl = useMemo(() => `/images/${NEXT_PUBLIC_TENANT}.png`, [])

  return (
    <header className="" id="header-main">
      <Navbar expand="sm" className="navbar-main shadow" id="navbar-main">
        <Container>
          {/* <Navbar.Toggle
            className="order-lg-2 ml-n3 ml-lg-0"
            type="button"
            aria-controls="navbar-main-collapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          /> */}

          <Link href="/" passHref>
            <Navbar.Brand className="order-lg-1">
              <img alt="Logo" src={logoUrl} id="navbar-logo" />
            </Navbar.Brand>
          </Link>
          {/* <Navbar.Collapse
            className="navbar-collapse-overlay order-lg-3"
            id="navbar-main-collapse"
          > */}
          {/* <div className="position-relative">
              <Navbar.Toggle
                type="button"
                data-toggle="collapse"
                aria-controls="navbar-main-collapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <IconX />
              </Navbar.Toggle>
            </div>
            <Nav className="ml-lg-auto mr-3">
              <Nav.Item className="nav-item-spaced d-lg-block">
                <Link href="/action-centre" passHref>
                  <Nav.Link className="nav-link">
                    <IconList />
                    Action Centre
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className="nav-item-spaced d-lg-block">
                <Link href="/education-centre" passHref>
                  <Nav.Link className="nav-link">
                    <IconShield />
                    Security Academy
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className="nav-item-spaced d-lg-block">
                <Link href="/cyber-governance-centre" passHref>
                  <Nav.Link className="nav-link">
                    <IconBook />
                    Policy Centre
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className="nav-item-spaced d-lg-block">
                <Link href="/market-place" passHref>
                  <Nav.Link className="nav-link">
                    <IconShoppingBag />
                    Market Place
                  </Nav.Link>
                </Link>
              </Nav.Item>
            </Nav> */}

          {/* <Nav className="align-items-lg-center d-none d-lg-flex ml-lg-auto">
              <Dropdown
                className={`nav-item dropdown-animate ${styles['menu-settings']}`}
                navbar
                alignRight
              >
                <Dropdown.Toggle className="nav-link nav-link-icon px-2" as="a">
                  <IconSettings />
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="dropdown-menu-sm dropdown-menu-arrow p-3"
                  align="right"
                >
                  <Dropdown.Header as="h6" className="px-0 mb-2 text-primary">
                    Hi, Emma!
                  </Dropdown.Header>

                  <Link href="/company-settings" passHref>
                    <Dropdown.Item>
                      <IconHome />
                      <span>Company Settings</span>
                    </Dropdown.Item>
                  </Link>
                  <Link href="/account-settings" passHref>
                    <NavDropdown.Item href="../../pages/boards/overview.html">
                      <IconUser />
                      <span>Account Settings</span>
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/" passHref>
                    <Dropdown.Item href="../../pages/account/settings.html">
                      <IconHeadphones />
                      <span>Support Centre</span>
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <i data-feather="log-out" />
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav> */}
          {/* </Navbar.Collapse> */}
          <div className="order-lg-4 ml-lg-3">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
            <a
              className=""
              role="button"
              onClick={() => {
                dispatch(toggleProfileModal(true))
              }}
            >
              <span className="avatar rounded-circle bg-primary">
                {shortName}
              </span>
            </a>
          </div>
        </Container>
      </Navbar>
    </header>
  )
}
