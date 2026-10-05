import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import UserService from '../services/UserService'

export default function withUnauthenticated(Component) {
  // eslint-disable-next-line react/display-name
  return props => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const cached = UserService.getSession()
      if (cached) {
        router.push('/')
      } else {
        setLoading(false)
      }
    }, [router])

    if (loading) {
      return null
    }

    return <Component {...props} />
  }
}
