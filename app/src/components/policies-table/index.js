/* eslint-disable no-unused-vars */
import React, { useRef, useCallback, useMemo, useEffect, useState } from 'react'
import { Table, Input, Space, Button } from 'antd'
import {
  Badge,
  Dropdown,
  ProgressBar,
  Button as BootstrapButton,
} from 'react-bootstrap'
import { MoreHorizontal } from 'react-feather'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import JSzip from 'jszip'
import styles from './styles.module.scss'
import PoliciesService from '../../services/PoliciesService'
import { POLICY_ACKNOWLEDGE_BADGE, POLICY_TYPE } from '../../constants'
import {
  getAllPolicies,
  getAssignedPolicies,
  openEditCyberModal,
  openUploadPolicy,
  setAssigningCompanyPolicies,
  setAssigningCompanyPolicy,
  getOneCompanyPolicy,
} from '../../states/policies'
import download, { downloadBlob } from '../../utilities/download'
import { openAssignStaffToPolicyModal } from '../../states/staffs'

export default function PoliciesTable({ policies, isEditing, policyType }) {
  const [formatedPolicies, setFormatedPolicies] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const searchInputRef = useRef()
  const { user } = useSelector(state => state.auth?.session)
  const router = useRouter()
  const dispatch = useDispatch()

  const onSelectChange = useCallback(selectedKeys => {
    setSelectedRowKeys(selectedKeys)
  }, [])

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [onSelectChange, selectedRowKeys]
  )

  useEffect(() => {
    ;(async () => {
      const formatPolicies = await Promise.all(
        policies.map(async policy => {
          const cloned = { ...policy }
          const [policyAssignedUsers, acknowledgedNumber] = await Promise.all([
            PoliciesService.getAssignedPolicyById(undefined, policy.id),
            PoliciesService.countPolicyAcknowledged(policy.id),
          ])
          cloned.acknowledged = policyAssignedUsers.data.find(
            assignedPolicy => assignedPolicy.user.id === user.id
          )?.isAcknowledged
            ? POLICY_ACKNOWLEDGE_BADGE.ACKNOWLEDGED
            : POLICY_ACKNOWLEDGE_BADGE.PENDING
          cloned.acknowledgePercent = (
            policyAssignedUsers.data.length === 0
              ? 0
              : (acknowledgedNumber.data * 100) /
                policyAssignedUsers.data.length
          ).toFixed(1)
          cloned.key = policy.id
          return cloned
        })
      )
      setFormatedPolicies(formatPolicies)
    })()
  }, [policies, user.id])

  const onGetMoreInfo = useCallback(record => {
    if (record) {
      dispatch(getOneCompanyPolicy({ id: record.id }))
        .unwrap()
        .then(async data => {
          dispatch(
            openUploadPolicy({
              ...record,
              policyFile: data?.policyFile,
            })
          )
        })
        .catch(() => {
          toast.warn('Could not fetch company policy')
        })
    } else {
      dispatch(openUploadPolicy(record))
    }
  }, [])

  const onEdit = useCallback(
    record =>
      record.type === POLICY_TYPE.CYBER
        ? dispatch(openEditCyberModal(record))
        : onGetMoreInfo(record),
    [dispatch]
  )

  const exportPolicy = useCallback(record => {
    toast.info(`Downloading policy "${record.name}"...`)
    if (record.pdfFile) {
      download(
        `${process.env.NEXT_PUBLIC_API}${record.policyFile.url}`,
        record.policyFile.name
      )
    } else {
      PoliciesService.downloadPolicy(record.id).then(pdf => {
        download(pdf, `${record.name}.pdf`)
      })
    }
  }, [])

  const deletePolicy = useCallback(
    record => {
      Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to delete this policy?',
        text: 'This action cannot be undone.',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        preConfirm() {
          return PoliciesService.deletePolicy(record.id)
            .then(result => Promise.resolve(result))
            .catch(error => {
              toast.error(error.message || 'Could not delete policy!')
              return Promise.reject(error)
            })
        },
      }).then(result => {
        if (result.isConfirmed) {
          toast.success('Deleted policy successfully!')
          dispatch(getAllPolicies())
          dispatch(getAssignedPolicies())
        }
      })
    },
    [dispatch]
  )

  const assignPolicy = useCallback(
    record => {
      dispatch(openAssignStaffToPolicyModal())
      dispatch(setAssigningCompanyPolicy(record))
    },
    [dispatch]
  )

  const handleSearch = (selectedKeys, confirm) => {
    confirm()
  }

  const handleReset = clearFilters => {
    clearFilters()
  }

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
        title: 'Name',
        dataIndex: 'name',
        ...getColumnSearchProps('name'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
        render: value => <strong>{value}</strong>,
        ...(!isEditing && {
          width: '20%',
        }),
      },
      ...(policyType === POLICY_TYPE.CYBER
        ? [
            {
              title: 'Status',
              dataIndex: 'isLive',
              filters: isEditing
                ? [
                    {
                      text: 'Assigned',
                      value: true,
                    },
                    {
                      text: 'Unassigned',
                      value: false,
                    },
                  ]
                : [
                    {
                      text: 'Pending',
                      value: 'Pending',
                    },
                    {
                      text: 'Acknowledged',
                      value: 'Acknowledged',
                    },
                  ],
              sorter: (a, b) => {
                if (isEditing) {
                  if (a.isLive && !b.isLive) return 1
                  if (!a.isLive && !b.isLive) return -1
                  return 0
                }
                if (
                  a.acknowledged === 'Acknowledged' &&
                  b.acknowledged !== 'Acknowledged'
                )
                  return 1
                if (
                  a.acknowledged !== 'Acknowledged' &&
                  b.acknowledged === 'Acknowledged'
                )
                  return -1
                return 0
              },
              sortDirections: ['descend', 'ascend'],
              onFilter: (value, record) =>
                isEditing
                  ? record.isLive === value
                  : record.acknowledged === value,
              ...(!isEditing && {
                width: '20%',
              }),
              render: (value, record) =>
                isEditing ? (
                  <Badge
                    variant={record.isLive ? 'success' : 'light'}
                    className="mb-1 d-inline-block"
                  >
                    {record.isLive ? 'Assigned' : 'Unassigned'}
                  </Badge>
                ) : (
                  <Badge
                    variant={
                      record.acknowledged ===
                      POLICY_ACKNOWLEDGE_BADGE.ACKNOWLEDGED
                        ? 'success'
                        : 'warning'
                    }
                  >
                    {record.acknowledged}
                  </Badge>
                ),
            },
          ]
        : []),
      ...(policyType === POLICY_TYPE.COMPANY && !isEditing
        ? [
            {
              title: 'Status',
              dataIndex: 'isLive',
              width: '20%',
              filters: [
                {
                  text: 'Pending',
                  value: 'Pending',
                },
                {
                  text: 'Acknowledged',
                  value: 'Acknowledged',
                },
              ],
              sorter: (a, b) => {
                if (isEditing) {
                  if (a.isLive && !b.isLive) return 1
                  if (!a.isLive && !b.isLive) return -1
                  return 0
                }
                if (
                  a.acknowledged === 'Acknowledged' &&
                  b.acknowledged !== 'Acknowledged'
                )
                  return 1
                if (
                  a.acknowledged !== 'Acknowledged' &&
                  b.acknowledged === 'Acknowledged'
                )
                  return -1
                return 0
              },
              sortDirections: ['descend', 'ascend'],
              onFilter: (value, record) =>
                isEditing
                  ? record.isLive === value
                  : record.acknowledged === value,
              render: (value, record) => (
                <Badge
                  variant={
                    record.acknowledged ===
                    POLICY_ACKNOWLEDGE_BADGE.ACKNOWLEDGED
                      ? 'success'
                      : 'warning'
                  }
                >
                  {record.acknowledged}
                </Badge>
              ),
            },
          ]
        : []),
      ...(isEditing
        ? [
            {
              title: 'Acknowledged',
              dataIndex: 'acknowledgePercent',
              sorter: (a, b) =>
                Number(a.acknowledgePercent) - Number(b.acknowledgePercent),
              sortDirections: ['descend', 'ascend'],
              render: (value, record) => (
                <ProgressBar
                  style={{ height: 16 }}
                  variant="success"
                  now={value}
                  label={`${value}%`}
                />
              ),
            },
          ]
        : []),
      {
        title: 'Published date',
        dataIndex: 'publishedDate',
        sorter: (a, b) =>
          moment(a.publishedDate).valueOf() - moment(b.publishedDate).valueOf(),
        sortDirections: ['descend', 'ascend'],
        render: record => (
          <b>{moment(record?.publishedDate).format('DD MMMM, YYYY')}</b>
        ),
        ...(!isEditing && {
          width: '20%',
        }),
      },
      {
        title: 'Policy Owner',
        dataIndex: 'owner',
        ...getColumnSearchProps('owner'),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
        ...(!isEditing && {
          width: '20%',
        }),
      },
      ...(isEditing
        ? [
            {
              title: 'Actions',
              render: (value, record) => (
                <Dropdown className="action-item p-0">
                  <Dropdown.Toggle
                    as="a"
                    className={`action-item ${styles['action-btn']}`}
                  >
                    <MoreHorizontal />
                  </Dropdown.Toggle>

                  <Dropdown.Menu alignRight>
                    {((!record?.isLive && policyType === POLICY_TYPE.CYBER) ||
                      policyType === POLICY_TYPE.COMPANY) && (
                      <Dropdown.Item onClick={() => onEdit(record)}>
                        Edit
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item onClick={() => exportPolicy(record)}>
                      Export
                    </Dropdown.Item>
                    {policyType === POLICY_TYPE.CYBER && (
                      <Dropdown.Item onClick={() => assignPolicy(record)}>
                        Assign
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      className="text-danger"
                      onClick={() => deletePolicy(record)}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ),
            },
          ]
        : []),
    ],
    [
      assignPolicy,
      deletePolicy,
      exportPolicy,
      getColumnSearchProps,
      isEditing,
      onEdit,
      policyType,
    ]
  )

  const onClickRow = useCallback(
    record => {
      router.push(`/cyber-governance-centre/${record?.id}`)
    },
    [router]
  )

  const exportSelectedPolicies = useCallback(() => {
    const selectedPolicies = formatedPolicies.filter(policy =>
      selectedRowKeys.includes(policy.id)
    )
    toast.info('Downloading files, please wait...')
    const promises = selectedPolicies.map(async item => {
      const url = await PoliciesService.downloadPolicy(item.id)
      const t = await fetch(url)
      const b = await t.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = error => {
          reject(error)
        }
        reader.readAsBinaryString(b)
      })
    })
    Promise.all(promises).then(pdfs => {
      toast.info('Compressing, please wait...')
      const zip = new JSzip()
      pdfs.forEach((pdf, index) => {
        zip.file(`${selectedPolicies[index].name}.pdf`, pdf, { binary: true })
      })
      zip.generateAsync({ type: 'blob' }).then(content => {
        downloadBlob(
          content,
          `${
            policyType === POLICY_TYPE.COMPANY ? 'company' : 'cybersecurity'
          }-policies.zip`
        )
      })
    })
  }, [selectedRowKeys, formatedPolicies])

  const deleteSelectedPolicies = useCallback(() => {
    Swal.fire({
      icon: 'question',
      title: 'Delete policies',
      text: `Are you sure you want to delete ${selectedRowKeys.length} policies?`,
      showCancelButton: true,
      confirmButtonText: 'Delete all',
      preConfirm() {
        return new Promise((resolve, reject) => {
          const promises = selectedRowKeys.map(id =>
            PoliciesService.deletePolicy(id)
          )
          Promise.all(promises)
            .then(results => {
              resolve(results)
              toast.success('Deleted all policies!')
            })
            .catch(errors => {
              reject(errors)
              toast.warn('Could not delete policies.')
            })
        })
      },
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(getAllPolicies())
        dispatch(getAssignedPolicies())
      }
    })
  }, [selectedRowKeys])

  const assignPolicies = useCallback(() => {
    dispatch(openAssignStaffToPolicyModal())
    dispatch(setAssigningCompanyPolicies(selectedRowKeys))
  }, [selectedRowKeys])

  return (
    <>
      {!!selectedRowKeys.length && (
        <div className="d-flex">
          <BootstrapButton variant="neutral" onClick={exportSelectedPolicies}>
            Export
          </BootstrapButton>
          {policyType === POLICY_TYPE.CYBER && (
            <BootstrapButton variant="neutral" onClick={assignPolicies}>
              Assign
            </BootstrapButton>
          )}
          <BootstrapButton variant="neutral" onClick={deleteSelectedPolicies}>
            Delete
          </BootstrapButton>
        </div>
      )}
      <Table
        columns={columns}
        style={{ cursor: 'pointer' }}
        dataSource={formatedPolicies}
        rowSelection={rowSelection}
        expandable={{ rowExpandable: false }}
        onRow={record => ({
          onClick: () => {
            if (isEditing) return
            onClickRow(record)
          },
        })}
      />
    </>
  )
}
