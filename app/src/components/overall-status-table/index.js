import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getCompanySummary } from '../../states/auth'
import styles from './styles.module.scss'

export default function OverallStatusTable() {
  const dispatch = useDispatch()
  const { companySummary } = useSelector(state => state.auth)

  const searchInputRef = useRef()
  const router = useRouter()

  useEffect(() => {
    dispatch(getCompanySummary())
  }, [dispatch])

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
  }

  const handleReset = clearFilters => {
    clearFilters()
  }

  const getColumnSearchProps = useCallback((dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInputRef}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current.select(), 100)
      }
    },
    render: text => text
  }), [])

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Email',
      dataIndex: 'username',
      ...getColumnSearchProps('username'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Completed Courses',
      dataIndex: 'completedCourses',
      sorter: (a, b) => a.completedCourses - b.completedCourses,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Pending Courses',
      dataIndex: 'pendingCourses',
      sorter: (a, b) => a.pendingCourses - b.pendingCourses,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Acknowledged Policies',
      dataIndex: 'acknowledgedPolicies',
      sorter: (a, b) => a.acknowledgedPolicies - b.acknowledgedPolicies,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Pending Policies',
      dataIndex: 'pendingPolicies',
      sorter: (a, b) => a.pendingPolicies - b.pendingPolicies,
      sortDirections: ['descend', 'ascend']
    }
  ], [getColumnSearchProps])

  const dataSource = useMemo(() => companySummary?.overall?.map(staff => {
    const cloned = {...staff}
    Object.assign(cloned, {
      name: `${staff.firstName} ${staff.lastName}`,
      acknowledgedPolicies: staff.policy.acknowledged,
      pendingPolicies: staff.policy.pending,
      pendingCourses: staff.course.pending,
      completedCourses: staff.course.completed
    })
    return { ...cloned, key: staff.id}
  }), [companySummary])

  const onClickRow = useCallback((record) => {
    router.query.userId = record.userId
    router.push(router)
  }, [router])


  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        expandable={{ rowExpandable: false }}
        onRow={(record) => ({
          onClick: () => onClickRow(record),
        })}
        rowClassName={styles['table-row']} 
      />
    </>
  )
}
