import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import AppContext from '../contexts/app-context'
import { USER_ROLE } from '../constants'

export default function AppProvider({ children }) {
  const user = useSelector(state => state.auth?.session?.user)

  const isClient = useMemo(
    () => user && user.role.name === USER_ROLE.CLIENT,
    [user]
  )

  return (
    <AppContext.Provider
      value={{
        isClient,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
