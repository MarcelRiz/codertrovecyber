import React from 'react'
import styles from './styles.module.scss'

export default function Loading() {
  return (
    <>
      <div className={`preloader ${styles.loading}`}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  )
}