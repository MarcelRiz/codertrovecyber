import React, { useEffect, useMemo } from 'react'
import { Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import { List as IconList } from 'react-feather'
import { get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { getQuestionGroups } from '../../states/action-items'
import { me } from '../../states/auth'

export default function StepToSecure() {
  const user = useSelector(state => state.auth.session?.user)
  const { questionGroups } = useSelector(state => state.actionItems)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(me())
    dispatch(getQuestionGroups())
  }, [dispatch])

  /**
   * check if all security audits are completed
   * @type {boolean}
   */
  const assessmentCompleted = useMemo(() => {
    const groupIds = questionGroups.map(item => item.id)
    const userGroupIds = get(user, 'companyUserQuestionGroups', []).map(item => item.questionGroup.id)
    const notCompletedIds = groupIds.filter(
      item => !userGroupIds.includes(item)
    )

    return !(notCompletedIds.length > 0)
  }, [questionGroups, user])

  return (
    <Card>
      <Card.Body>
        <IconList size={32} />
        <Card.Title className="mt-3">
          {!assessmentCompleted ? (
            <>Cyber Security Audit</>
          ) : (
            <>Threat Centre</>
          )}
        </Card.Title>
        <div className="text-muted mb-3">
          {!assessmentCompleted ? (
            <>
              Complete our Cyber Security Audit to find out what actions you
              need to take to protect your company from Cyber attacks.
            </>
          ) : (
            <>
              This is where the vulnerabilities we have identified through the
              assessment live. We have defined the risk and explain why the
              issue is important. We highlight the corrective action required
              and then tie that issue to best practice standards.
            </>
          )}
        </div>
        {!assessmentCompleted ? (
          <>
            <Link href="/security-audit">
              <Button variant="primary" className="btn-block">
                Complete Security Audit
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/threat-centre">
              <Button variant="primary">Take action</Button>
            </Link>
          </>
        )}
      </Card.Body>
    </Card>
  )
}
