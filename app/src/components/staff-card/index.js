import React, { useMemo } from 'react'
import { Card, Col, Dropdown } from 'react-bootstrap'
import { MoreHorizontal, AtSign, Phone } from 'react-feather'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { USER_ROLE } from '../../constants'

export default function StaffCard({ staff, onEdit, onDelete, onCheck, isCheck, onUpdateStaffRole }) {
  const userRole = useSelector(state => state.auth.session?.user?.role?.type)
  const user = useSelector(state => state.auth.session?.user)

  const isDisableUpdateUser = useMemo(() => {
    if (staff.previousRole && staff.previousRole.name === USER_ROLE.STAFF) {
      return true
    }
    if (!user.previousRole) {
      return !!user.previousRole || false
    }
    return true
  }, [user, staff])

  return (
    <Card className="mb-3 hover-shadow-lg">
      <Card.Body className="d-flex align-items-start align-items-lg-center flex-wrap flex-lg-nowrap px-2 py-3">
        {
          userRole === 'client' && <Col xs={1} lg={1}>
            <input
              type="checkbox"
              checked={isCheck}
              onChange={() => onCheck(staff.id)}
            />
          </Col>
        }
        <Col xs={9} lg={2}>
          <b>
            {staff?.firstName} {staff?.lastName}
          </b>
        </Col>
        <Col lg={3}>
          <AtSign className="mr-2" />
          {staff?.email}
        </Col>
        <Col lg={3}>
          <Phone className="mr-2" />
          {staff?.phone}
        </Col>
        <Col lg={2} className='d-flex'>
          {staff?.departmentId?.name}
        </Col>

        <Col xs={2} lg={1} className="text-right order-lg-5">
          <Dropdown className="action-item p-0">
            <Dropdown.Toggle
              as="a"
              className={`action-item ${styles['action-btn']}`}
            >
              <MoreHorizontal />
            </Dropdown.Toggle>

            <Dropdown.Menu alignRight>
              {
                !isDisableUpdateUser && <Dropdown.Item
                  onClick={onUpdateStaffRole}
                >
                  Update to Client role
                </Dropdown.Item>
              }
              <Dropdown.Item onClick={onEdit}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={onDelete} className="text-danger">
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Card.Body>
    </Card>
  )
}
