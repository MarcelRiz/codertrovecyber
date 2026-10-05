import React, { useCallback, useContext, useEffect } from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import { Shield as IconShield, AlertCircle } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPolicies } from '../../states/policies'
import Loading from '../loading'
import AppContext from '../../contexts/app-context'

export default function DashboardCyberPolicies() {
  const user = useSelector(state => state.auth?.session?.user)
  const { policies, gettingPolicies } = useSelector(state => state.policies)
  const { isClient } = useContext(AppContext)
  const dispatch = useDispatch()

  /**
   * get all policies
   * @type {(function(): void)|*}
   */
  const getPolicies = useCallback(() => {
    dispatch(getAllPolicies())
  }, [dispatch])

  /**
   * on load
   */
  useEffect(() => {
    getPolicies()
  }, [getPolicies])

  return (
    <Card>
      <Card.Body>
        <IconShield size={32} />
        <Card.Title className="mt-3">Cyber Governance Centre</Card.Title>
        {isClient ? (
          <div className="text-muted mb-3">
            Here is where you can quickly create, manage and download all the
            polices and procedures you will need to get started or strengthen
            your organisations Cyber security posture
          </div>
        ) : (
          <div className="text-muted mb-3">
            View, read and acknowledge company policies.
          </div>
        )}

        {gettingPolicies && (
          <div className="text-center">
            <Loading />
          </div>
        )}

        {!user?.children?.length && isClient && (
          <>
            <Link href="/company-settings">
              <Alert variant="warning" style={{ cursor: 'pointer' }}>
                <AlertCircle color="white" size={16} className="mr-2" />
                To get started, add your staff so you can assign them your
                company and Cyber policies.
              </Alert>
            </Link>
          </>
        )}

        {policies?.length === 0 && (
          <Alert variant="info">
            <AlertCircle color="white" size={16} className="mr-2" />
            No policies were added
          </Alert>
        )}
        <div className="mt-3">
          <Link href="/cyber-governance-centre">
            <Button variant="primary">Go to policy centre</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
