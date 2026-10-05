import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import UserService from '../services/UserService'

export default function withAuthenticated(Component) {
  // eslint-disable-next-line react/display-name
  return props => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const cached = UserService.getSession()
      if (!cached) {
        toast.warn('You have been logged out!')
        const destination = router.pathname
        if (destination && destination.length > 1) {
          router.push(`/login?redirectUrl=${destination}`)
        } else {
          router.push('/login')
        }
      } else {
        setLoading(false)
      }
    }, [router.pathname])

    if (loading) {
      return null
    }

    return <Component {...props} />
  }
}
