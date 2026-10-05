import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { Button as BootstrapButton, Dropdown } from 'react-bootstrap'
import { Plus, MoreHorizontal, Trash } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { isEmpty, get } from 'lodash'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ModalAddStaffs from '../modal-add-staffs'
import ModalAddGroupGoPhish from '../modal-add-group-gophish'
import {
  getStaffsList,
  openAddModal,
  openAssignPolicyModal,
  openEditStaff,
  toggleGoPhishAddModal,
} from '../../states/staffs'
import ModalEditStaff from '../modal-edit-staff'
import StaffsService from '../../services/StaffsService'
import Loading from '../loading'
import styles from './styles.module.scss'
import { USER_ROLE } from '../../constants'
import ModalAssignPolicies from '../assign-policy-modal'

export default function StaffsList() {
  const dispatch = useDispatch()
  const { gettingStaffs, staffs } = useSelector(state => state.staffs)
  const userRole = useSelector(state => state.auth.session?.user?.role?.type)
  const departments = useSelector(state => state.auth.departments) || []
  const user = useSelector(state => state.auth.session?.user)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visibleAddGoPhish, setVisibleAddGoPhish] = useState(false)

  const searchInputRef = useRef()

  const onSelectChange = useCallback(selectedKeys => {
    setSelectedRowKeys(selectedKeys)
  }, [])

  const resetChecked = useCallback(() => {
    setSelectedRowKeys([])
  }, [])

  /**
   * open add staff modal
   * @type {(function(): void)|*}
   */
  const openModalAddGroupGoPhish = useCallback(() => {
    dispatch(toggleGoPhishAddModal(true))
  }, [dispatch])

  /**
   * open add staff modal
   * @type {(function(): void)|*}
   */
  const openModalAdd = useCallback(() => {
    dispatch(openAddModal())
  }, [dispatch])

  /**
   * open edit staff modal
   * @type {(function(*=): void)|*}
   */
  const openModalEdit = useCallback(
    staff => {
      dispatch(openEditStaff(staff))
    },
    [dispatch]
  )

  /**
   * get staffs list
   * @type {(function(): void)|*}
   */
  const getStaffs = useCallback(() => {
    dispatch(getStaffsList())
  }, [dispatch])

  /**
   * delete selected staffs
   * @type {(function(*): void)|*}
   */
  const deleteSelectedStaffs = useCallback(() => {
    Swal.fire({
      title: 'Delete staffs',
      text: 'Are you sure you want to delete these staffs?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete staffs!',
      showLoaderOnConfirm: true,
      preConfirm: () => StaffsService.deleteStaffs(selectedRowKeys),
    }).then(result => {
      if (result.isConfirmed) {
        setSelectedRowKeys([])
        toast.success('Deleted staffs successfully!')
        getStaffs()
      }
    })
  }, [getStaffs, selectedRowKeys])

  /**
   * delete staff
   * @type {(function(*): void)|*}
   */
  const deleteStaff = useCallback(
    staff => {
      Swal.fire({
        title: 'Delete staff',
        text: `Are you sure you want to delete ${staff.firstName} ${staff.lastName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete staff!',
        showLoaderOnConfirm: true,
        preConfirm: () => StaffsService.deleteStaff(staff.id),
      }).then(result => {
        if (result.isConfirmed) {
          toast.success('Deleted staff successfully!')
          getStaffs()
        }
      })
    },
    [getStaffs]
  )

  /**
   * update staff role
   * @type {(function(*): void)|*}
   */
  const updateStaffRole = useCallback(
    staff => {
      Swal.fire({
        title: 'Update staff role',
        text: `Are you sure you want to update "${staff.firstName} ${staff.lastName}" to client role?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update staff!',
        showLoaderOnConfirm: true,
        preConfirm: () =>
          StaffsService.updateUserRole({ userId: staff.id, roleType: 'client' })
            .then(response => response)
            .catch(err => {
              toast.error(err)
              return false
            }),
      }).then(result => {
        if (result.isConfirmed) {
          toast.success('Update staff role successfully')
          getStaffs()
        }
      })
    },
    [getStaffs]
  )

  /**
   * on load get staffs
   */
  useEffect(() => {
    getStaffs()
  }, [getStaffs])

  useEffect(() => {
    setVisibleAddGoPhish(!!selectedRowKeys.length)
  }, [selectedRowKeys])

  const createGroupValue = useMemo(() => {
    if (!isEmpty(staffs) && !isEmpty(selectedRowKeys)) {
      const getData = selectedRowKeys.map(key => {
        const staff = staffs.find(item => item.id === key)
        return {
          email: staff.email,
          first_name: staff.firstName,
          last_name: staff.lastName,
          position: get(staff, 'role.type'),
        }
      })
      return getData
    }
    return []
  }, [selectedRowKeys, staffs])

  const openModalAssignPolicies = useCallback(
    userRecord => {
      dispatch(openAssignPolicyModal({ users: [userRecord] }))
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
      },
      {
        title: 'Email',
        dataIndex: 'username',
        ...getColumnSearchProps('username'),
        sorter: (a, b) => a.username.localeCompare(b.username),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        ...getColumnSearchProps('phone'),
        sorter: (a, b) => a.phone.length - b.phone.length,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Department',
        dataIndex: 'departmentName',
        ...getColumnSearchProps('departmentName'),
        sorter: (a, b) => a.departmentName.localeCompare(b.departmentName),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Actions',
        render: (text, record) => {
          const isDisableUpdateUser = () => {
            if (
              record.previousRole &&
              record.previousRole.name === USER_ROLE.STAFF
            ) {
              return true
            }
            if (!user.previousRole) {
              return !!user.previousRole || false
            }
            return true
          }
          return (
            <Dropdown className="action-item p-0">
              <Dropdown.Toggle
                as="a"
                className={`action-item ${styles['action-btn']}`}
              >
                <MoreHorizontal />
              </Dropdown.Toggle>

              <Dropdown.Menu alignRight>
                {!isDisableUpdateUser() && (
                  <Dropdown.Item onClick={() => updateStaffRole(record)}>
                    Update to Client role
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={() => openModalAssignPolicies(record)}>
                  Assign policies
                </Dropdown.Item>
                <Dropdown.Item onClick={() => openModalEdit(record)}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => deleteStaff(record)}
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )
        },
      },
    ],
    [
      deleteStaff,
      getColumnSearchProps,
      openModalEdit,
      updateStaffRole,
      user.previousRole,
    ]
  )

  const dataSource = useMemo(
    () =>
      staffs.map(staff => {
        const cloned = { ...staff }
        const departmentName = departments.find(
          department => department.id === staff.departmentId?.id
        )?.name
        Object.assign(cloned, {
          name: `${staff.firstName} ${staff.lastName}`,
          departmentName,
        })
        delete cloned.children
        return { ...cloned, key: staff.id }
      }),
    [staffs]
  )

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: onSelectChange,
    }),
    [onSelectChange, selectedRowKeys]
  )

  return (
    <div className="mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5>Staff Management</h5>
        </div>

        <div className="d-flex justify-content-between">
          {!!selectedRowKeys.length && (
            <BootstrapButton variant="neutral" onClick={deleteSelectedStaffs}>
              <Trash className="mr-2" />
              Delete selected staffs
            </BootstrapButton>
          )}
          {userRole === 'client' && visibleAddGoPhish && (
            <BootstrapButton
              variant="neutral"
              onClick={openModalAddGroupGoPhish}
            >
              <Plus className="mr-2" />
              Add to phishing group
            </BootstrapButton>
          )}
          <BootstrapButton variant="neutral" onClick={openModalAdd}>
            <Plus className="mr-2" />
            Add staff
          </BootstrapButton>
        </div>
      </div>

      {gettingStaffs && (
        <div className="text-center">
          <Loading />
        </div>
      )}

      <Table
        id="staff-table"
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        expandable={{ rowExpandable: false }}
      />

      <div className="text-center text-muted">
        Your staff will be notified periodically as they move through their
        security journey on new content and progress through the course. The
        business has full transparency on compliance and completion of this
        content which builds cyber resilience in your organisation
      </div>

      <ModalAddGroupGoPhish
        groupValue={createGroupValue}
        resetChecked={resetChecked}
      />

      <ModalAddStaffs />

      <ModalEditStaff />

      <ModalAssignPolicies />
    </div>
  )
}
