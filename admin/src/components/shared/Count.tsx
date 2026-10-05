import React, { useEffect, useState } from 'react'

const Count = ({ label = '', number, duration }) => {
  const [count, setCount] = useState('0')

  useEffect(() => {
    if (!number) {
      setCount('0')
      return
    }
    let start = 0
    const end = parseFloat(number)
    if (start >= end) return
    const totalMilSecDur = parseInt(duration, 10)
    const incrementTime = (totalMilSecDur / end) * 900
    const timer = setInterval(() => {
      start += 1
      if (start < end) {
        setCount(String(start))
      }

      if (start >= end) {
        setCount(String(end))
        clearInterval(timer)
      }

    }, incrementTime)

  }, [number])

  return (
    <>
      {label && <span>{label}</span>}
      {count}
    </>
  )
}

export default Count