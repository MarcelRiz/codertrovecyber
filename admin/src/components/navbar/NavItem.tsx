import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './styles.module.scss'
import NavItemHeader from './NavItemHeader'

const NavItem = props => {
  const {
    item: { label, Icon, to, children },
  } = props
  const { item } = props
  const router = useRouter()

  const showIcon = () => {
    if (to === '/')
      return (
        <i className={`${styles['navbar-icon']} fas fa-tachometer-alt`}></i>
      )
    if (Icon) return <Icon className={styles['navbar-icon']} />
    return null
  }

  if (children) {
    return <NavItemHeader item={item} />
  }

  return (
    <li
      className={`${
        router.pathname === to ? 'active bg-dark-secondary' : ''
      } nav-item `}
    >
      <Link href={to}>
        <a href="#!" className={styles['navbar-link']}>
          {showIcon()}
          {label}
        </a>
      </Link>
    </li>
  )
}

export default NavItem
