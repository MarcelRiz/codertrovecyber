import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import ActionItemPriority from '../action-item-priority'
import { openActionItem } from '../../states/action-items'
import { ACTION_ITEM_TYPE, CUSTOM_ACTION_ITEM_SOURCE } from '../../constants'

export default function ActionItemsTable({
  actionItems,
  type,
  onSelectChange,
  selectedRowKeys,
}) {
  const [formatActionItems, setFormatActionItems] = useState([])
  const [categories, setCategories] = useState([])
  const searchInputRef = useRef()
  const dispatch = useDispatch()

  const priorityPoints = useMemo(
    () => ({
      high: 3,
      medium: 2,
      low: 1,
    }),
    []
  )

  useEffect(() => {
    const categoryList = []
    const formatData = actionItems.map(item => {
      if (!categoryList.includes(item.category))
        categoryList.push(item.category)
      const isCustomActionItem = item.type === ACTION_ITEM_TYPE.CUSTOM
      const actionItem = isCustomActionItem
        ? item.customActionItem
        : item.actionItem
      const actionSource = isCustomActionItem
        ? CUSTOM_ACTION_ITEM_SOURCE[actionItem?.actionItemSource] || 'Custom'
        : 'Assessment'
      return {
        ...item,
        key: item.id,
        summary: item.actionItem.actionItemSummary,
        actionItem,
        actionSource,
      }
    })
    setFormatActionItems(formatData)
    setCategories(categoryList)
  }, [actionItems])

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
  }

  const handleReset = clearFilters => {
    clearFilters()
  }

  const onClickRow = useCallback(
    record => {
      dispatch(openActionItem(record))
    },
    [dispatch]
  )

  const getColumnSearchProps = useCallback(
    dataIndex => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputRef}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInputRef.current.select(), 100)
        }
      },
      render: text => text,
    }),
    []
  )

  const columns = useMemo(
    () => [
      {
        title: 'Source',
        filters: [
          {
            text: 'Assessment',
            value: 'Assessment',
          },
          {
            text: 'Custom',
            value: 'Custom',
          },
          {
            text: 'Check In',
            value: 'Check In',
          },
          {
            text: 'Report',
            value: 'Report',
          },
        ],
        onFilter: (value, record) => record.actionSource === value,
        sorter: (a, b) => a.actionSource.localeCompare(b.actionSource),
        sortDirections: ['descend', 'ascend'],
        render: record => <b>{record.actionSource}</b>,
      },
      {
        title: 'Summary',
        dataIndex: 'summary',
        ...getColumnSearchProps('summary'),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        filters: categories.map(category => ({
          text: category,
          value: category,
        })),
        onFilter: (value, record) => record.category.indexOf(value) === 0,
      },
      {
        title: 'Priority',
        filters: [
          {
            text: 'High',
            value: 'high',
          },
          {
            text: 'Medium',
            value: 'medium',
          },
          {
            text: 'Low',
            value: 'low',
          },
        ],
        sorter: (a, b) =>
          priorityPoints[a.actionItem.priority] -
          priorityPoints[b.actionItem.priority],
        sortDirections: ['descend', 'ascend'],
        onFilter: (value, record) => record.actionItem.priority === value,
        render: record => (
          <ActionItemPriority priority={record.actionItem.priority} />
        ),
      },
    ],
    [categories, getColumnSearchProps, priorityPoints]
  )

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ],
    }),
    [onSelectChange, selectedRowKeys]
  )

  return (
    <>
      <Table
        id={
          formatActionItems[0]?.state === 'unresolved'
            ? 'theats_items_table'
            : 'theats_eliminated_table'
        }
        style={{ cursor: 'pointer' }}
        columns={columns}
        dataSource={formatActionItems}
        rowSelection={type === 'unresolved' ? rowSelection : null}
        expandable={{ rowExpandable: false }}
        onRow={record => ({
          onClick: () => onClickRow(record),
        })}
      />
    </>
  )
}
