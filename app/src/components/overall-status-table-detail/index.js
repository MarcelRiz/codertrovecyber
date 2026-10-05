import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { Container, Row, Col, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getUserSummaryDetail } from '../../states/auth'

export default function OverallStatusTableDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { userSummaryDetail } = useSelector(state => state.auth)
  const searchInputRef = useRef()

  useEffect(() => {
    const { query } = router
    if (query.userId) {
      dispatch(getUserSummaryDetail(query.userId))
    }
  }, [dispatch, router])

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

  const policyColumns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      width: '70%'
    },
    {
      title: 'Status',
      sorter: (a, b) => {
        if (a.status === 'Acknowledged' && b.status !== 'Acknowledged')
          return 1
        if (a.status !== 'Acknowledged' && b.status === 'Acknowledged')
          return -1
        return 0
      },
      filters: [
        {
          text: 'Pending',
          value: 'Pending'
        },
        {
          text: 'Acknowledged',
          value: 'Acknowledged'
        }
      ],
      sortDirections: ['descend', 'ascend'],
      onFilter: (value, record) => record.status === value,
      render: (record) => (
        <Badge variant={record.status === 'Pending' ? 'secondary' : 'info'}>
          {record?.status}
        </Badge>
      )
    }
  ], [getColumnSearchProps])

  const courseColumns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      width: '70%'
    },
    {
      title: 'Status',
      sorter: (a, b) => {
        if (a.status === 'Completed' && b.status !== 'Completed')
          return 1
        if (a.status !== 'Completed' && b.status === 'Completed')
          return -1
        return 0
      },
      filters: [
        {
          text: 'Pending',
          value: 'Pending'
        },
        {
          text: 'Completed',
          value: 'Completed'
        }
      ],
      sortDirections: ['descend', 'ascend'],
      onFilter: (value, record) => record.status === value,
      render: (record) => (
        <Badge variant={record.status === 'Pending' ? 'secondary' : 'info'}>
          {record?.status}
        </Badge>
      )
    }
  ], [getColumnSearchProps])
  
  return (
    <Container>
      <Row className='mb-3'>
        <Col xs={12}>
          <h4>
            <b>Courses</b>
          </h4>
        </Col>
      </Row>
      <div>
        {
          userSummaryDetail?.course
            && <Table columns={courseColumns} dataSource={userSummaryDetail?.course}/>
        }
      </div>

      <Row className='mb-3 mt-5'>
        <Col xs={12}>
          <h4>
            <b>Cybersecurity Policies</b>
          </h4>
        </Col>
      </Row>
      {
        userSummaryDetail?.policies?.CyberSecurity
        && <Table columns={policyColumns} dataSource={userSummaryDetail?.policies?.CyberSecurity}/>
      }

      <Row className='mb-3 mt-5'>
        <Col xs={12}>
          <h4>
            <b>Company Policies</b>
          </h4>
        </Col>
      </Row>
      {
        userSummaryDetail?.policies?.CompanyPolicy
        && <Table columns={policyColumns} dataSource={userSummaryDetail?.policies?.CompanyPolicy}/>
      }
    </Container>
  )
}
