import React, { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import TypeformGeneral from '../typeform-general'
import {
  closeCourse,
  getAssignedCourses,
  closeCourseTypeform,
} from '../../states/security-academy'
import CoursesService from '../../services/CoursesService'

export default function TypeformCourse() {
  const { user } = useSelector(state => state.auth?.session)
  const { viewingCourse, assignedCourses, showCourseTypeform } = useSelector(
    state => state.securityAcademy
  )
  const dispatch = useDispatch()

  /**
   * on close typeform
   * @type {(function(): void)|*}
   */
  const closeTypeForm = useCallback(() => {
    dispatch(closeCourseTypeform())
  }, [dispatch])

  /**
   * on submit typeform
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    event => {
      const find = assignedCourses.find(
        item => item.course.id === viewingCourse.id
      )
      if (find) {
        closeTypeForm()
        dispatch(closeCourse())
        return
      }

      const { responseId } = event
      CoursesService.createAssignedCourses(
        user?.id,
        viewingCourse.id,
        responseId
      )
        .then(() => {
          closeTypeForm()
          dispatch(getAssignedCourses())
        })
        .catch(() => {
          toast.warn('Could not completed course')
        })
    },
    [assignedCourses, dispatch, closeTypeForm, user, viewingCourse]
  )

  return (
    <TypeformGeneral
      formId={viewingCourse?.typeformID}
      show={showCourseTypeform}
      onClose={() => {
        closeTypeForm(false)
      }}
      onSubmit={onSubmit}
    />
  )
}
