import { createContext } from 'react'

const AppContext = createContext({
  isClient: false,
})

export default AppContext
