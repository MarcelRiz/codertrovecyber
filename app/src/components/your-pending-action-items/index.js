import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { get } from 'lodash'
import { ACTION_ITEM_STATE } from '../../constants'
import Theme from '../../utilities/theme'
import { CircleChartConfig } from '../../constants/configs'

const Circle = dynamic(() => import('../shared/progressbar-js/Circle'), {
  ssr: false,
})

export default function YourPendingActionItems() {
  const user = useSelector(state => state.auth.session?.user)

  /**
   * calculate percentage of resolved action items
   * @type {string}
   */
  const percentActionItems = useMemo(() => {
    const completed = get(user, 'companyUserActionItems', []).filter(
      item => item.state === ACTION_ITEM_STATE.RESOLVED
    ).length
    const total = get(user, 'companyUserActionItems', []).length
    return (((completed || 0) * 100) / (total || 1)).toFixed(1)
  }, [user])

  /**
   * get number of outstanding items
   * @type {*}
   */
  const actionItemOutstanding = useMemo(
    () =>
      get(user, 'companyUserActionItems', []).filter(
        item => item.state === ACTION_ITEM_STATE.UNRESOLVED
      ).length,
    [user]
  )

  const options3 = useMemo(
    () => ({
      color: Theme.getStyles().colors.theme.info,
      ...CircleChartConfig,
    }),
    []
  )

  return (
    <>
      <h5 id="actions_implementation" className="text-center">
        Actions and Implementations
      </h5>
      <Circle
        progress={percentActionItems}
        text={`${percentActionItems}%`}
        options={options3}
        initialAnimate
        className="progress-lg mx-auto mb-3"
        style={{
          width: 140,
          height: 140,
        }}
      />
      <div className="d-flex justify-content-between">
        <span className="text-muted">Outstanding</span>
        <strong className="ml-3 text-danger">{actionItemOutstanding}</strong>
      </div>
      <div className="d-flex justify-content-between">
        <span className="text-muted">Total</span>
        <strong className="ml-3">
          {get(user, 'companyUserActionItems', []).length}
        </strong>
      </div>
    </>
  )
}
