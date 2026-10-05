import React, { useMemo } from 'react'
import { ArrowUpCircle, ArrowDownCircle, ThumbsUp } from 'react-feather'
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ACTION_ITEM_PRIORITY } from '../../constants'

export default function ActionItemPriority({ priority, asBadge = false }) {
  const isHigh = useMemo(
    () => priority?.toLowerCase() === ACTION_ITEM_PRIORITY.HIGH,
    [priority]
  )

  const isMedium = useMemo(
    () => priority?.toLowerCase() === ACTION_ITEM_PRIORITY.MEDIUM,
    [priority]
  )

  const isLow = useMemo(
    () => priority?.toLowerCase() === ACTION_ITEM_PRIORITY.LOW,
    [priority]
  )

  const isBestPractice = useMemo(
    () => priority?.toLowerCase() === ACTION_ITEM_PRIORITY.BEST_PRACTICE,
    [priority]
  )

  const color = useMemo(() => {
    if (isHigh) return 'danger'
    if (isMedium) return 'warning'
    if (isLow) return 'success'
    if (isBestPractice) return 'success'
    return 'dark'
  }, [isHigh, isMedium, isLow, isBestPractice])

  const BadgeComp = ({ children }) => (
    <Badge variant={color} className="text-capitalize">
      {children}
      {priority} Priority
    </Badge>
  )

  const TooltipComp = ({ children }) => (
    <OverlayTrigger
      overlay={
        <Tooltip id="tooltip-priority">
          <span className="text-capitalize">{priority} Priority</span>
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  )

  const Icon = useMemo(() => {
    if (isHigh) return ArrowUpCircle
    if (isMedium) return ArrowUpCircle
    if (isLow) return ArrowDownCircle
    return ThumbsUp
  }, [isHigh, isMedium, isLow])

  if (asBadge) {
    return (
      <BadgeComp>
        <Icon size={16} className="mr-2" />
      </BadgeComp>
    )
  }
  return (
    <TooltipComp>
      <Icon size={16} className={`text-${color}`} />
    </TooltipComp>
  )
}
