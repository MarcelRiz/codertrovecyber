import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, ButtonGroup, Col, Row, ToggleButton } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle, AlertCircle } from 'react-feather'

import SkeletonComponent from '@components/shared/skeleton'
import Course from '../course'
import ModalPreviewCourse from '../modal-preview-course'
import {
  getAssignedCourses,
  getCoursesList,
} from '../../states/security-academy'
import TypeformCourse from '../typeform-course'
import { COURSE_STATUS } from '../../constants'

export default function SecurityCourses() {
  const { courses, gettingCourses, assignedCourses, gettingAssignedCourses } =
    useSelector(state => state.securityAcademy)
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('all')

  const radios = [
    { value: COURSE_STATUS.ALL, name: 'All' },
    { value: COURSE_STATUS.PENDING, name: 'Pending' },
    { value: COURSE_STATUS.COMPLETED, name: 'Completed' },
  ]

  /**
   * get all courses
   * @type {(function(): void)|*}
   */
  const getCourses = useCallback(() => {
    dispatch(getCoursesList())
    dispatch(getAssignedCourses())
  }, [dispatch])

  /**
   * get status of a course
   * @type {function(*): string}
   */
  const getStatus = useCallback(
    course => {
      const find = assignedCourses.find(item => item.course.id === course.id)
      return find ? COURSE_STATUS.COMPLETED : COURSE_STATUS.PENDING
    },
    [assignedCourses]
  )

  /**
   * filtered courses
   * @type {*[]}
   */
  const filteredCourses = useMemo(() => {
    if (filter === COURSE_STATUS.ALL) return courses
    return courses.filter(item => getStatus(item) === filter)
  }, [courses, filter, getStatus])

  /**
   * check if there's no pending courses
   * @type {unknown}
   */
  const isNoPending = useMemo(
    () => filteredCourses.length === 0 && filter === COURSE_STATUS.PENDING,
    [filter, filteredCourses.length]
  )

  /**
   * check if there's no completed courses
   * @type {unknown}
   */
  const isNoCompleted = useMemo(
    () => filteredCourses.length === 0 && filter === COURSE_STATUS.COMPLETED,
    [filter, filteredCourses.length]
  )

  useEffect(() => {
    getCourses()
  }, [getCourses])

  const isLoading = useMemo(
    () => gettingCourses || gettingAssignedCourses,
    [gettingCourses, gettingAssignedCourses]
  )

  return (
    <div>
      <ButtonGroup className="mb-2 btn-group-toggle">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={radio.name}
            id={`radio-${idx}`}
            type="radio"
            variant={filter === radio.value ? 'primary' : 'secondary'}
            name="radio"
            value={radio.value}
            checked={filter === radio.value}
            active={filter === radio.value}
            onChange={e => setFilter(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>

      {isLoading && (
        <SkeletonComponent loading paragraph={{ rows: 15, width: '60%' }}>
          <span />
        </SkeletonComponent>
      )}

      <Row>
        {filteredCourses.map(course => (
          <Col key={course.id} md={6} lg={3}>
            <Course course={course} status={getStatus(course)} />
          </Col>
        ))}

        <ModalPreviewCourse />

        <TypeformCourse />
      </Row>

      {isNoPending && (
        <Alert variant="success">
          <CheckCircle className="mr-3" />
          Take a bow, you have no pending courses
        </Alert>
      )}

      {isNoCompleted && (
        <Alert variant="warning">
          <AlertCircle className="mr-3" />
          The journey of a thousand miles starts with the first step- lets get
          started on a course…
        </Alert>
      )}
    </div>
  )
}
