import React, { useState } from 'react'
import Link from 'next/link'
import * as Icons from 'react-feather'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

const NavItemHeader = props => {
  const { item } = props
  const { label, Icon, to: headerToPath, children } = item
  const router = useRouter()

  const [expanded, setExpand] = useState(
    router.pathname === headerToPath ||
      !!children.find(child => child.to === router.pathname)
  )

  const onExpandChange = e => {
    e.preventDefault()
    setExpand(prev => !prev)
  }

  return (
    <>
      <a
        role="button"
        className={`${styles['navbar-link']} d-flex justify-content-between`}
        onClick={onExpandChange}
        onKeyDown={onExpandChange}
        href="#!"
      >
        <div className="d-flex">
          <Icon className={styles['navbar-icon']} />
          <span className={styles.navLabel}>{label}</span>
        </div>
        <Icons.ChevronDown
          className={`${styles.navItemHeaderChevron} ${
            expanded && styles.chevronExpanded
          }`}
        />
      </a>

      {expanded && (
        <div className={styles.navChildrenBlock}>
          {children.map((child, index) => {
            const key = `${child.label}-${index}`

            const { label: childLabel, Icon: ChildIcon, to: childTo } = child

            return (
              <li
                className={`${
                  router.pathname === childTo ? 'active bg-dark-secondary' : ''
                } nav-item `}
              >
                <Link key={key} href={childTo}>
                  <a href="#!" className={styles['navbar-link']}>
                    {ChildIcon && (
                      <ChildIcon className={styles['navbar-icon']} />
                    )}
                    {childLabel}
                  </a>
                </Link>
              </li>
            )
          })}
        </div>
      )}
    </>
  )
}

export default NavItemHeader
