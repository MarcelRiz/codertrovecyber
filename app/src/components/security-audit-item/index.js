import React, { useCallback, useMemo, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { Check as IconCheck, Info as IconInfo } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TypeformGeneral from '../typeform-general'
import ActionItemsService from '../../services/ActionItemsService'
import { setFetchMeTime } from '../../states/auth'

export default function SecurityAuditItem({ item }) {
  const [showForm, setShowForm] = useState(false)
  const [sending, setSending] = useState(false)
  const user = useSelector(state => state.auth.session?.user)
  const companyUserQuestionGroups = user?.companyUserQuestionGroups
  const dispatch = useDispatch()

  /**
   * on completed assessment
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    event => {
      setShowForm(false)
      setSending(true)
      ActionItemsService.submitAssessment(event.responseId, item.id)
        .then(() => {
          dispatch(setFetchMeTime())
        })
        .catch(error => {
          toast.warn(error.message || 'Could not send assessment.')
        })
        .finally(() => {
          setSending(false)
        })
    },
    [dispatch, item]
  )

  /**
   * on closing typeform
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    setShowForm(false)
  }, [])

  /**
   * on opening typeform
   * @type {(function(): void)|*}
   */
  const open = useCallback(() => {
    setShowForm(true)
  }, [])

  /**
   * check if audit item is completed
   * @type {boolean}
   */
  const isCompleted = useMemo(
    () => !!companyUserQuestionGroups.find(qg => qg.questionGroup.id === item.id),
    [item.id, companyUserQuestionGroups]
  )

  return (
    <>
      <Card className="hover-translate-y-n10">
        <Card.Body className="text-center py-6">
          <div className="pb-4">
            <div
              className={`icon text-dark rounded-circle icon-shape shadow ${
                isCompleted ? 'bg-success' : 'bg-warning'
              }`}
            >
              {isCompleted ? (
                <IconCheck size={24} color="white" />
              ) : (
                <IconInfo size={24} />
              )}
            </div>
          </div>
          <div className="py-2">
            <h5 className="mb-0">{item?.name}</h5>
          </div>
          <div className="mt-2">
            {!isCompleted ? (
              <Button
                block
                variant="primary"
                className="rounded-pill btn-icon"
                onClick={open}
                disabled={sending}
              >
                {sending && (
                  <span className="btn-inner--icon">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </span>
                )}
                <span className="btn-inner--text">Start</span>
              </Button>
            ) : (
              <div className="text-success p-2 px-3">Finished</div>
            )}
          </div>
        </Card.Body>
      </Card>
      <TypeformGeneral
        show={showForm}
        onClose={onClose}
        formId={item.typeformQuestionId}
        onSubmit={onSubmit}
      />
    </>
  )
}
