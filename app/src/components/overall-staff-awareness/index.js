import React, { useMemo, useRef, memo } from 'react'
import { useSelector } from 'react-redux'
import Theme from '../../utilities/theme'
import Circle from '../shared/progressbar-js/Circle'
import { CircleChartConfig } from '../../constants/configs'

function OverallStaffAwareness() {
  const { companySummary } = useSelector(state => state.auth)
  const chart1 = useRef()
  const options = useMemo(
    () => ({
      color: Theme.getStyles().colors.theme.danger,
      ...CircleChartConfig,
    }),
    []
  )

  return (
    <>
      <h5 id="knowlegde_edu" className="text-center">
        Knowledge and Education
      </h5>
      <Circle
        ref={chart1}
        progress={companySummary.staffAwarenessCompleted || 0}
        text={`${(companySummary?.staffAwarenessCompleted || 0).toFixed(1)}%`}
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
          {companySummary.staffAwarenessOutstanding || 0}
        </strong>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-muted">Total</span>
        <strong className="ml-3">
          {companySummary.staffAwarenessTotal || 0}
        </strong>
      </div>
    </>
  )
}

const MemmoizedOverallStaffAwareness = memo(OverallStaffAwareness)
export default MemmoizedOverallStaffAwareness
