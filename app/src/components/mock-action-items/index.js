import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import Fuse from 'fuse.js'
import { DUMMY_THREAT_DATA } from '@src/constants/threatData'
import ModalActionItem from '../modal-action-item'
import { markActionItemCompletedBulk } from '../../states/action-items'
import {
  ACTION_ITEM_PRIORITY,
  ACTION_ITEM_STATE,
  ACTION_ITEM_TYPE,
} from '../../constants'
import { setFetchMeTime } from '../../states/auth'
import ActionItemsTable from '../action-items-table'

export default function ActionItems({ unresolved = true }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.session?.user)
  const { bulkResolving, search } = useSelector(state => state.actionItems)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  /**
   * sort action items by priority
   * @type {*[]}
   */
  const actionItems = useSelector(() => {
    const companyUserActionItems = DUMMY_THREAT_DATA || []
    return companyUserActionItems?.sort((a, b) => {
      const priorityA =
        a.type === ACTION_ITEM_TYPE.ASSESSMENT
          ? a.actionItem?.priority
          : a.customActionItem?.priority
      const priorityB =
        b.type === ACTION_ITEM_TYPE.ASSESSMENT
          ? b.actionItem?.priority
          : b.customActionItem?.priority
      const orders = [
        ACTION_ITEM_PRIORITY.HIGH.toLowerCase(),
        ACTION_ITEM_PRIORITY.MEDIUM.toLowerCase(),
        ACTION_ITEM_PRIORITY.LOW.toLowerCase(),
        ACTION_ITEM_PRIORITY.BEST_PRACTICE.toLowerCase(),
      ]

      return (
        orders.indexOf(priorityA?.toLowerCase()) -
        orders.indexOf(priorityB?.toLowerCase())
      )
    })
  })

  /**
   * list of action items, applying fuzzy search
   * @type {unknown}
   */
  const filteredActionItems = useMemo(() => {
    if (!search) return actionItems
    const fuse = new Fuse(actionItems, {
      keys: [
        'actionItem.actionItemDetails',
        'actionItem.actionItemSummary',
        'actionItem.category',
        'actionItem.Priority',
        'customActionItem.actionItemDetails',
        'customActionItem.actionItemSummary',
        'customActionItem.actionItemSource',
      ],
    })
    return fuse.search(search).map(item => item.item)
  }, [search, actionItems])

  /**
   * get unresolved action items
   */
  const unresolvedActionItems = useMemo(
    () =>
      filteredActionItems.filter(
        item => item.state === ACTION_ITEM_STATE.UNRESOLVED
      ),
    [filteredActionItems]
  )

  /**
   * get resolved action items
   */
  const resolvedActionItems = useMemo(
    () =>
      filteredActionItems.filter(
        item => item.state === ACTION_ITEM_STATE.RESOLVED
      ),
    [filteredActionItems]
  )

  /**
   * download action items
   * @type {(function(): void)|*}
   */
  const download = useCallback(() => {
    setIsDownloading(true)
    axios
      .post('/api/download-action-items', {
        items: actionItems,
        industryScore: user?.companies[0]?.industry?.rating || 0,
        companySecurity: user?.securityRating?.company || 0,
      })
      .then(res => {
        const a = document.createElement('a')
        a.download = 'action-items.pdf'
        a.href = res.data
        a.click()
      })
      .catch(() => {})
      .finally(() => {
        setIsDownloading(false)
      })
  }, [user, actionItems])

  /**
   * mark all selected action items as completed
   * @type {(function(): void)|*}
   */
  const completeSelectedActionItems = useCallback(() => {
    Swal.fire({
      title: 'Complete action items',
      text: `Are you sure you want to complete ${selectedRowKeys.length} action items?`,
      confirmButtonText: 'Mark as completed',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      icon: 'question',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(markActionItemCompletedBulk(selectedRowKeys))
          .unwrap()
          .then(() => {
            dispatch(setFetchMeTime())
            toast.success('Marked action items as resolved!')
          })
          .catch(() => {
            toast.warn('Could not mark action items as resolved!')
          })
      }
    })
  }, [dispatch, selectedRowKeys])

  const onSelectChange = useCallback(selectedKeys => {
    setSelectedRowKeys(selectedKeys)
  }, [])

  return (
    <div className="mt-5">
      {unresolved && (
        <>
          <div className="d-lg-flex justify-content-between mb-3 align-items-center">
            <h3 className="h5">Pending Items</h3>
            <div>
              {selectedRowKeys.length > 0 && (
                <Button
                  variant="neutral"
                  onClick={completeSelectedActionItems}
                  disabled={bulkResolving}
                  className="btn-icon"
                >
                  {bulkResolving && (
                    <span className="btn-inner--icon">
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </span>
                  )}
                  <span className="btn-inner--text">
                    Complete selected actions
                  </span>
                </Button>
              )}
            </div>
          </div>
          <ActionItemsTable
            actionItems={unresolvedActionItems}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={onSelectChange}
            type="unresolved"
          />
        </>
      )}

      {!unresolved && (
        <>
          <div className="d-lg-flex justify-content-between mb-3 align-items-center">
            <h3 className="h5">Completed Items</h3>
          </div>
          <ActionItemsTable
            actionItems={resolvedActionItems}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={onSelectChange}
            type="resolved"
          />
        </>
      )}

      <div className="mt-5 text-center">
        <Button variant="neutral" onClick={download} className="btn-icon">
          {isDownloading && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
          <span className="btn-inner--text">Download all threat items</span>
        </Button>
      </div>

      <ModalActionItem />
    </div>
  )
}
