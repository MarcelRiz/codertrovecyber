import React, { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  submitAssessment,
  toggleAssessmentModal,
} from '../../states/action-items'
import TypeformGeneral from '../typeform-general'
import { setFetchMeTime } from '../../states/auth'

export default function TypeformAssessment() {
  const { showAssessment } = useSelector(state => state.actionItems)
  const dispatch = useDispatch()

  /**
   * close assessment
   * @type {(function(): void)|*}
   */
  const closeAssessment = useCallback(() => {
    dispatch(toggleAssessmentModal(false))
  }, [dispatch])

  /**
   * on submitting assessment
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    event => {
      dispatch(submitAssessment(event.responseId))
        .unwrap()
        .then(() => {
          dispatch(setFetchMeTime())
          toast.success('Assessment completed')
        })
        .catch(() => {
          toast.warn('There was error in submitting your assessment')
        })
      closeAssessment()
    },
    [closeAssessment, dispatch]
  )

  return (
    <TypeformGeneral
      show={showAssessment}
      formId={process.env.NEXT_PUBLIC_TYPEFORM_ASSESSMENT_ID}
      onSubmit={onSubmit}
      onClose={closeAssessment}
    />
  )
}
