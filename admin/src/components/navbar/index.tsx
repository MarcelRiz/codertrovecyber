import React from 'react'
import { navBarItems } from '../../constants/navbar-items'
import styles from './styles.module.scss'
import NavItem from './NavItem'

const { NEXT_PUBLIC_TENANT } = process.env

export default function Navbar() {
  return (
    <div className={`${styles.navbar}`}>
      <div className={`${styles['navbar-logo']} text-center`}>
        <img
          src={`/images/logo/${NEXT_PUBLIC_TENANT}.png`}
          style={{ maxWidth: '100%' }}
          alt={`${NEXT_PUBLIC_TENANT}`}
        />
      </div>
      <ul className="nav flex-column">
        {navBarItems.map(item => (
          <NavItem key={`${item.label}`} item={item} />
        ))}
      </ul>
    </div>
  )
}
