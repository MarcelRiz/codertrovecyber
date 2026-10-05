import React, { useCallback, useMemo } from 'react'
import { Badge, Button, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import {
  closeActionItem,
  markActionItemCompleted,
} from '../../states/action-items'
import { ACTION_ITEM_STATE, ACTION_ITEM_TYPE } from '../../constants'
import { setFetchMeTime } from '../../states/auth'
import ActionItemPriority from '../action-item-priority'

export default function ModalActionItem() {
  const {
    viewingItem: item,
    showItemModal,
    resolving,
  } = useSelector(state => state.actionItems)

  const dispatch = useDispatch()

  /**
   * get correct action item base on type
   */
  const actionItem = useMemo(
    () =>
      item?.type === ACTION_ITEM_TYPE.CUSTOM
        ? item?.customActionItem
        : item?.actionItem,
    [item]
  )

  /**
   * mark action item as completed
   * @type {(function(): void)|*}
   */
  const markAsCompleted = useCallback(() => {
    dispatch(markActionItemCompleted(item.id))
      .unwrap()
      .then(() => {
        Swal.fire({
          title: 'Threat eliminated',
          text: 'Well done on addressing this challenge. You have moved one step closer to improving your defenses',
          icon: 'success',
        })
        dispatch(closeActionItem())
        dispatch(setFetchMeTime())
      })
      .catch(error => {
        toast.error(error.message || 'Could not mark action item as completed')
      })
  }, [item, dispatch])

  // const requestAssistance = useCallback(() => {
  //   Swal.fire({
  //     title: 'Assistance query created',
  //     // eslint-disable-next-line quotes
  //     text: "We're always happy to help you out. Your query has been forwarded to our Cybersecurity Success team. Someone will be in touch soon.",
  //     icon: 'success',
  //   })
  //   dispatch(closeActionItem())
  // }, [dispatch])

  const isUnresolved = useMemo(
    () => item?.state === ACTION_ITEM_STATE.UNRESOLVED,
    [item]
  )

  if (!item) return null

  return (
    <Modal
      show={showItemModal}
      size="lg"
      onHide={() => {
        dispatch(closeActionItem())
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{actionItem?.actionItemSummary}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ActionItemPriority priority={actionItem?.priority} asBadge />
        <Badge variant="light" className="ml-2">
          {item.type === ACTION_ITEM_TYPE.CUSTOM ? 'Custom' : 'Assessment'}
        </Badge>
        <dl className="row mt-3">
          {actionItem?.securityDomain && (
            <>
              <dt className="col-md-4">Control</dt>
              <dd className="col-md-8 font-weight-bolder">
                {actionItem?.securityDomain}
              </dd>
            </>
          )}

          {actionItem?.controlMapping && (
            <>
              <dt className="col-md-4">Control Mapping</dt>
              <dd className="col-md-8 font-weight-bolder">
                {actionItem?.controlMapping}
              </dd>
            </>
          )}
        </dl>
        <div className="mt-3">
          <div
            dangerouslySetInnerHTML={{
              __html: actionItem?.actionItemDetails,
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        {isUnresolved && (
          <Button
            variant="primary"
            onClick={markAsCompleted}
            disabled={resolving}
            className="btn-icon"
          >
            {resolving && (
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )}
            <span className="btn-inner--text">Mark as completed</span>
          </Button>
        )}
        {/* <Button variant="warning" onClick={requestAssistance}> */}
        {/*  Request assistant */}
        {/* </Button> */}
      </Modal.Footer>
    </Modal>
  )
}
