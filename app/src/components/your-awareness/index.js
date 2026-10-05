import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import Theme from '../../utilities/theme'
import { CircleChartConfig } from '../../constants/configs'

const Circle = dynamic(() => import('../shared/progressbar-js/Circle'), {
  ssr: false,
})

export default function YourAwareness() {
  const userSummary = useSelector(state => state.auth?.userSummary)

  /**
   * calculate percentage of completed courses
   * @type {string}
   */
  const coursePercent = useMemo(
    () => userSummary?.staffAwarenessCompleted?.toFixed(1),
    [userSummary]
  )

  const options = useMemo(
    () => ({
      color: Theme.getStyles().colors.theme.danger,
      ...CircleChartConfig,
    }),
    []
  )
  return (
    <>
      <h5 className="text-center">Knowledge and Education</h5>
      <Circle
        progress={coursePercent}
        text={`${coursePercent}%`}
        options={options}
        initialAnimate
        className="progress-lg mx-auto mb-3"
        style={{
          width: 140,
          height: 140,
        }}
      />
      <div className="d-flex justify-content-between">
        <span className="text-muted">Outstanding</span>
        <strong className="ml-3 text-danger">
          {userSummary?.staffAwarenessOutstanding}
        </strong>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-muted">Total</span>
        <strong className="ml-3">{userSummary?.staffAwarenessTotal}</strong>
      </div>
    </>
  )
}
