import React from 'react'

export default function Breadcrumb({ children }) {
  return (
    <nav aria-label="breadcrumb" className='bg-light-secondary'>
      <ol className="breadcrumb rounded-0 border-right-0 border-left-0">
        <li className="breadcrumb-item active" aria-current="page">
          {children}
        </li>
      </ol>
    </nav>
  )
}