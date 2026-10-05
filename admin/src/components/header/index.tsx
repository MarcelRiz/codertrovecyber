import Link from 'next/link'
import React from 'react'
import { signOut, useSession } from 'next-auth/client'
import * as Icon from 'react-feather'
import styles from './styles.module.scss'
import useComponentVisible from '../use-hook/use-component-visible'

export default function Header() {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible
  } = useComponentVisible(false)
  const [session] = useSession()
  const getShortName = () => {
    const name = session?.user?.name?.split(' ')
    return name[0]?.charAt(0) + name[1]?.charAt(0)
  }
  return (
    <header>
      <nav className="navbar navbar-horizontal navbar-dark bg-primary justify-content-end">
        <div className={`${styles['header-profile']} d-flex justify-content-end align-items-center`}>
          <div ref={ref}>
            <span aria-hidden="true" 
            onClick={() => { setIsComponentVisible(!isComponentVisible) }} 
            className={`avatar bg-white text-primary  rounded-circle avatar-sm ${styles['header-avatar']}`}>
              {session?.user?.image && (<img src={session?.user?.image} alt={session?.user?.name} />)}
              {!session?.user?.image && getShortName()}
            </span>
            <div className={`dropdown-menu dropdown-menu-sm dropdown-menu-right dropdown-menu-arrow p-3 ${isComponentVisible && 'show'}`}>
              <h6 className="dropdown-header px-0 mb-2 text-primary">Hi, {session?.user?.name}!</h6>
              <Link href="/">
                <a href="#!" className="dropdown-item">
                  <Icon.Activity width="1em" />
                  <span>Dashboard</span>
                </a>
              </Link>
              <div className="dropdown-divider"></div>
              <Link href="/api/auth/signout">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    localStorage.clear()
                    signOut({redirect: false})
                  }}
                  className="dropdown-item" aria-hidden="true">
                  <Icon.LogOut width="1em" />
                  <span>Logout</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}