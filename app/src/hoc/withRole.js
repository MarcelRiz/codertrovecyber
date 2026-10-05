import React, { useEffect, useState } from 'react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import UserService from '../services/UserService'

export default function withRole(Component, roleName) {
  // eslint-disable-next-line react/display-name
  return props => {
    const router = useRouter()
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const cached = UserService.getSession()
      if (cached) {
        setRole(cached.user.role.name)
        setLoading(false)
      } else {
        const destination = router.pathname

        router.push(
          `/login${
            destination && destination.length > 1
              ? `?redirectUrl=${destination}`
              : ''
          }`
        )
      }
    }, [router.pathname])

    if (loading) return null

    if (role === roleName) return <Component {...props} />

    return <Error statusCode={403} title="Access Denied" />
  }
}
