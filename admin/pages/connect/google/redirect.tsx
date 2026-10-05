import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Loading } from '../../../src/components'

export default function RedirectGoogle() {
  const router = useRouter()
  const queryParam = router?.query

  useEffect(() => {
    if (!queryParam?.id_token) {
      return
    }
    async function verifyAuth() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?id_token=${queryParam?.id_token}&access_token=${queryParam?.access_token}`)
        if (response?.data?.jwt) {
          localStorage.setItem('userLogged', JSON.stringify(response?.data?.user))
          localStorage.setItem('auth_token', response?.data?.jwt)
          window.location.href = '/'
        }
      } catch {
        window.location.href = '/login'
      }

    }
    verifyAuth()
  }, [queryParam?.id_token, queryParam?.access_token])

  return (<Loading />)
}