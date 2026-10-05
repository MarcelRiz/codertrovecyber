import React, { useCallback, useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { logout, me, setSession } from '../../states/auth'
import UserService from '../../services/UserService'
import { getQuestionGroups } from '../../states/action-items'
import AppContext from '../../contexts/app-context'

export default function AppInitializer({ children }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { fetchMeTime, session } = useSelector(state => state.auth)
  const { isClient } = useContext(AppContext)

  // on app load, read cached data to redux
  useEffect(() => {
    const cached = UserService.getSession()
    if (cached) {
      dispatch(setSession(cached))
    }
  }, [dispatch])

  const fetchQuestionGroups = useCallback(() => {
    if (isClient && session?.user && session?.jwt) {
      dispatch(getQuestionGroups())
    }
  }, [session, isClient, dispatch])

  // function to update from cloud to redux and cache
  const fetchMe = useCallback(() => {
    const cached = UserService.getSession()
    if (!cached) return
    dispatch(me())
      .unwrap()
      .then(data => {
        if (
          data.periodEnd &&
          new Date(data.periodEnd).getTime() < new Date().getTime()
        ) {
          toast.error(
            'Your subscription was canceled. Please resubscribe to access your account again'
          )
          router.push('/login').then(() => {
            dispatch(logout())
            UserService.clearSession()
          })
          return
        }
        // update cached info
        const cachedSession = UserService.getSession()
        cachedSession.user = data
        const isRemember = UserService.getIsRemember()
        UserService.saveSession(cachedSession, isRemember)
      })
      .catch(() => {
        // getting fail mean session is out or something wrong.
        router.push('/login').then(() => {
          dispatch(logout())
          UserService.clearSession()
        })
      })
  }, [dispatch])

  useEffect(() => {
    fetchMe()

    const interval = setInterval(() => {
      fetchMe()
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  }, [fetchMe, fetchMeTime])

  useEffect(() => {
    fetchQuestionGroups()
  }, [fetchQuestionGroups, fetchMeTime])

  return <>{children}</>
}
