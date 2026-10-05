import React, { useCallback, useMemo } from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import LinesEllipsis from 'react-lines-ellipsis'
import { openCourseTypeform } from '../../states/security-academy'
import styles from './styles.module.scss'
import { COURSE_STATUS } from '../../constants'

export default function Course({ course, status = '' }) {
  const dispatch = useDispatch()

  /**
   * on open course typeform
   * @type {(function(): void)|*}
   */
  const open = useCallback(() => {
    dispatch(openCourseTypeform(course))
  }, [course, dispatch])

  /**
   * get the course background image
   * @type {string}
   */
  const background = useMemo(() => {
    if (course.courseImage && course.courseImage.url) {
      return `url(${process.env.NEXT_PUBLIC_API}${course.courseImage.url})`
    }
    return ''
  }, [course.courseImage])

  const badgeVariant = useMemo(
    () => (status === COURSE_STATUS.PENDING ? 'warning' : 'success'),
    [status]
  )

  return (
    <Card
      className={`hover-translate-y-n3 hover-shadow-lg overflow-hidden ${styles.card}`}
    >
      <div className="position-relative overflow-hidden">
        {status && (
          <Badge
            variant={badgeVariant}
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
            }}
          >
            {status}
          </Badge>
        )}
        {/* eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid */}
        <a href="javascript:void(0)" className="d-block" onClick={open}>
          <div
            className={`card-img card-img-top ${styles['card-img']}`}
            style={{
              backgroundImage: background,
            }}
          />
        </a>
      </div>
      <Card.Body className="py-4">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
        <h5
          className={`h5 stretched-link lh-150 cursor-pointer ${styles['course-title']}`}
          onClick={open}
        >
          {course.name}
        </h5>
        <p className="mt-3 mb-0 lh-170">
          <LinesEllipsis
            style={{ height: '82px' }}
            text={course.description}
            maxLine={3}
            trimRight
          />
        </p>
      </Card.Body>
      <Card.Footer className="card-footer border-0 delimiter-top">
        <Button
          variant="primary"
          className="btn-block rounded-pill"
          onClick={open}
        >
          Start course
        </Button>
      </Card.Footer>
    </Card>
  )
}
