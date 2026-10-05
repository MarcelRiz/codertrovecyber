import React, { useMemo, useRef, memo } from 'react'
import { useSelector } from 'react-redux'
import Theme from '../../utilities/theme'
import Circle from '../shared/progressbar-js/Circle'
import { CircleChartConfig } from '../../constants/configs'

function OverallPolicyStatus() {
  const { companySummary } = useSelector(state => state.auth)
  const chart1 = useRef()
  const options = useMemo(
    () => ({
      color: Theme.getStyles().colors.theme.warning,
      ...CircleChartConfig,
    }),
    []
  )

  /**
   * get acknowledgement percent
   * @type {string}
   */
  const percentPolicy = useMemo(() => {
    const completed = companySummary.policyAcknowledged
    const total = companySummary.policyTotal
    return (((completed || 0) * 100) / (total || 1)).toFixed(1)
  }, [companySummary.policyTotal, companySummary.policyTotal])

  return (
    <>
      <h5 id="polies_procedures" className="text-center">
        Policies and Procedures
      </h5>
      <Circle
        ref={chart1}
        progress={percentPolicy}
        text={`${percentPolicy}%`}
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
          {companySummary?.policyOutstanding || 0}
        </strong>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-muted">Total</span>
        <strong className="ml-3">{companySummary?.policyTotal || 0}</strong>
      </div>
    </>
  )
}

const MemmoizedOverallPolicyStatus = memo(OverallPolicyStatus)
export default MemmoizedOverallPolicyStatus
