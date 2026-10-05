import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { BookOpen } from 'react-feather'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal } from '@fortawesome/free-solid-svg-icons'
import {
  getAssignedCourses,
  getCoursesList,
} from '../../states/security-academy'

export default function YourCoursesBadges() {
  const { assignedCourses, courses } = useSelector(
    state => state.securityAcademy
  )
  const dispatch = useDispatch()

  /**
   * get all courses and assigned items
   * @type {(function(): void)|*}
   */
  const getData = useCallback(() => {
    dispatch(getCoursesList())
    dispatch(getAssignedCourses())
  }, [dispatch])

  /**
   * get status of course
   * @type {function(*): string}
   */
  const getStatus = useCallback(
    course => {
      const find = assignedCourses.find(item => item.course.id === course.id)
      return find ? 'completed' : 'pending'
    },
    [assignedCourses]
  )

  /**
   * sort courses by status
   * @type {*[]}
   */
  const sortedCourses = useMemo(
    () =>
      [...courses].sort((a, b) => {
        const statusA = getStatus(a)
        const statusB = getStatus(b)
        return statusA.localeCompare(statusB, 'en')
      }),
    [courses, getStatus]
  )

  /**
   * get data on load
   */
  useEffect(() => {
    getData()
  }, [getData])

  return (
    <Card>
      <Card.Body>
        <div className="mb-3">
          <BookOpen size={32} />
        </div>
        <Card.Title>Course Badges</Card.Title>
        <Row>
          {sortedCourses.map(course => (
            <Col key={course.id} xs={3} className="pb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{course.name}</Tooltip>}
              >
                <FontAwesomeIcon
                  icon={faMedal}
                  size="3x"
                  className={
                    getStatus(course) === 'completed'
                      ? 'text-success'
                      : 'text-muted'
                  }
                />
              </OverlayTrigger>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  )
}
