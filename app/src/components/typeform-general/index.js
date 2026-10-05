import React, { useEffect } from 'react'
import { Widget } from '@typeform/embed-react'
import { Button } from 'react-bootstrap'
import styles from './styles.module.scss'

export default function TypeformGeneral({
  formId = null,
  show = false,
  onSubmit = () => {},
  onClose = () => {},
}) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      document.body.parentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = null
      document.body.parentElement.style.overflow = null
    }
  }, [show])

  if (!formId) return null

  if (!show) return null

  return (
    <div className={styles['typeform-modal']}>
      <Button
        variant="light"
        className={`${styles.close} rounded-circle`}
        onClick={onClose}
      >
        &times;
      </Button>
      <Widget id={formId} className={styles.form} onSubmit={onSubmit} />
    </div>
  )
}
