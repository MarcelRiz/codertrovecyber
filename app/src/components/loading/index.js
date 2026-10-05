import React from 'react'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Loading() {
  return (
    <div className="d-inline-flex" style={{ width: 32, height: 32 }}>
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  )
}
