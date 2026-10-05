import React, { useMemo } from 'react'
import { Card, Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import {
  ACTION_ITEM_STATE,
  ACTION_ITEM_TYPE,
  CUSTOM_ACTION_ITEM_SOURCE,
} from '../../constants'
import ActionItemPriority from '../action-item-priority'

export default function ActionItemCard({ item, selected, onSelect, onClick }) {
  /**
   * get correct action item data, CUSTOM or ASSESSMENT
   */
  const actionItem = useMemo(() => {
    if (item.type === ACTION_ITEM_TYPE.CUSTOM) {
      return item.customActionItem
    }
    return item.actionItem
  }, [item])

  /**
   * check if action item is resolved
   * @type {boolean}
   */
  const isItemUnResolved = useMemo(
    () => item.state.toLowerCase() === ACTION_ITEM_STATE.UNRESOLVED,
    [item]
  )

  /**
   * check if type of action item is CUSTOM
   * @type {boolean}
   */
  const isCustomActionItem = useMemo(
    () => item.type === ACTION_ITEM_TYPE.CUSTOM,
    [item]
  )

  /**
   * display correct action item source
   * @type {string}
   */
  const actionSource = useMemo(
    () =>
      isCustomActionItem
        ? CUSTOM_ACTION_ITEM_SOURCE[actionItem?.actionItemSource] || 'Custom'
        : 'Assessment',
    [actionItem?.actionItemSource, isCustomActionItem]
  )

  return (
    <Card
      className="mb-3 hover-shadow-lg"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Card.Body className="d-flex align-items-start align-items-lg-center flex-wrap flex-lg-nowrap py-3">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <Col
          xs={2}
          lg={1}
          className="col-auto d-flex align-items-start align-items-lg-center px-0"
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {isItemUnResolved ? (
            <Form.Check
              id={`select-action-item-${item.id}`}
              type="checkbox"
              custom
              checked={selected}
              onChange={e => {
                onSelect(e.target.checked)
              }}
            />
          ) : (
            <div style={{ width: 32 }}>
              <FontAwesomeIcon
                size="2x"
                icon={faMedal}
                className="text-success"
              />
            </div>
          )}
        </Col>
        <Col
          xs={10}
          lg={6}
          className="d-flex align-items-start align-items-lg-center position-static py-lg-3 px-0  order-lg-2"
        >
          <div className="pr-lg-5">{actionItem?.actionItemSummary}</div>
        </Col>
        <Col lg={2} xs={4} className="pl-0 pl-md-2 pt-3 pt-lg-0">
          <span className="text-muted text-sm">Source</span>
          <br />
          <span className="h6 text-sm">{actionSource}</span>
        </Col>
        <Col lg={2} xs={4} className="text-left px-0 order-lg-4 pt-3 pt-lg-0">
          <span className="text-muted text-sm">Category:</span>
          <br />
          <strong>{actionItem?.category}</strong>
        </Col>
        <Col
          lg={1}
          xs={4}
          className="text-left text-lg-right px-0 order-lg-5 pt-3 pt-lg-0"
        >
          <span className="text-muted text-sm">Priority:</span>
          <br />
          <span>
            <ActionItemPriority priority={actionItem?.priority} />
          </span>
        </Col>
      </Card.Body>
    </Card>
  )
}

ActionItemCard.defaultProps = {
  selected: false,
  onSelect: () => {},
  onClick: () => {},
}
