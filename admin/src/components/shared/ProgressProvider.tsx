import React, {useEffect} from 'react'

const ProgressProvider = ({ valueStart, valueEnd, children }) => {
  const [value, setValue] = React.useState(valueStart)
  useEffect(() => {
    let start = 0
    const end = parseFloat(valueEnd)
    const timer = setInterval(() => {
      start += 1
      setValue(start)
      if (start >= end) {
        setValue(end)
        clearInterval(timer)
      }
    }, 10)
    return () => {
      clearInterval(timer)
    }
  }, [valueEnd])
  return children(value)
}

export default ProgressProvider