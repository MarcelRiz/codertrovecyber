import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Error from 'next/error'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { BookOpen, Calendar, User } from 'react-feather'
import moment from 'moment'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import withAuthenticated from '../../src/hoc/withAuthenticated'
import { POLICY_TYPE } from '../../src/constants'
import DefaultLayout from '../../src/layout/default'
import PageTitle from '../../src/components/page-title'
import Main from '../../src/components/main'
import PoliciesService from '../../src/services/PoliciesService'
import Loading from '../../src/components/loading'
import PdfViewer from '../../src/components/pdf-viewer'
import { getAssignedPolicies } from '../../src/states/policies'

function PagePolicyDetails() {
  const router = useRouter()
  const { id } = router.query
  const [policy, setPolicy] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [sending, setSending] = useState(false)
  const [policyContent, setPolicyContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [policyLoading, setPolicyLoading] = useState(true)

  const { assignedPolicies } = useSelector(state => state.policies)
  const dispatch = useDispatch()

  /**
   * Check user have acknowledge or not
   */
  const isAcknowledged = useMemo(
    () =>
      !!assignedPolicies.find(
        assignedPolicy => assignedPolicy.companyPolicy.id === Number(id)
      )?.isAcknowledged,
    [assignedPolicies, id]
  )

  /**
   * get policy details
   */
  const getPolicy = useCallback(() => {
    if (!id) return
    PoliciesService.getCompanyPolicyById(id)
      .then(response => {
        const pol = response.data
        if (pol.type === POLICY_TYPE.CYBER && !pol.isLive) {
          setNotFound(true)
        } else {
          setPolicy(pol)
        }
      })
      .catch(() => {
        setNotFound(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  /**
   * generate pdf link to render in pdf view
   */
  const generatePdfLink = useCallback(() => {
    if (policy.pdfFile) {
      setPolicyContent(
        `${process.env.NEXT_PUBLIC_API}${policy?.policyFile?.url}`
      )
    } else {
      PoliciesService.downloadPolicy(policy?.id).then(pdf => {
        setPolicyContent(pdf)
      })
    }
  }, [policy])

  /**
   * submit acknowledgement of this policy
   */
  const sendAcknowledgement = useCallback(() => {
    setSending(true)
    const assignedCompanyPolicy = assignedPolicies.find(
      assignedPolicy => assignedPolicy.companyPolicy.id === Number(id)
    )
    PoliciesService.acknowledgePolicy(assignedCompanyPolicy?.id)
      .then(() => {
        toast.success('Policy acknowledged')
        router.push('/cyber-governance-centre')
      })
      .catch(error => {
        toast.warn(error.message || 'Could not send policy acknowledgement')
      })
      .finally(() => {
        setSending(false)
      })
  }, [assignedPolicies, id, router])

  /**
   * Getter to check if policy is loaded
   * @type {boolean}
   */
  const isLoaded = useMemo(() => !!policy, [policy])

  /**
   * on load, get policy
   */
  useEffect(() => {
    getPolicy()
  }, [getPolicy])

  /**
   * when policy is loaded, find assigned item and generate pdf link
   */
  useEffect(() => {
    if (policy) {
      generatePdfLink()
    }
  }, [generatePdfLink, policy])

  /**
   * load assigned policies
   */
  useEffect(() => {
    dispatch(getAssignedPolicies())
  }, [dispatch])

  if (notFound) {
    return <Error statusCode={404} title="Policy Not Found" />
  }

  return (
    <DefaultLayout
      title="Policy Acknowledgement"
      isHome={false}
      breadcrumbs={[
        {
          url: '/cyber-governance-centre',
          text: 'Cyber Governance Centre',
        },
      ]}
    >
      {!isLoaded && (
        <div className="text-center">
          <Loading />
        </div>
      )}
      {isLoaded && (
        <>
          <PageTitle
            title={policy?.name}
            subtitle={
              policy?.type === POLICY_TYPE.CYBER
                ? 'Cybersecurity Policy'
                : 'Company Policy'
            }
          />
          <Main>
            <Card>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <User size={48} className="mr-2" />
                      <div className="flex-grow-1">
                        <div className="text-muted">Owner</div>
                        <div className="text-dark">
                          <strong>{policy?.owner}</strong>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <Calendar size={48} className="mr-2" />
                      <div className="flex-grow-1">
                        <div className="text-muted">Published Date</div>
                        <div className="text-dark">
                          <strong>
                            {moment(policy?.publishedDate).format(
                              'MMMM DD, YYYY'
                            )}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="d-flex align-items-center">
                      <BookOpen size={48} className="mr-2" />
                      <div className="flex-grow-1">
                        <div className="text-muted">Acknowledged</div>
                        <div className="text-dark">
                          <strong>{isAcknowledged ? 'YES' : 'NO'}</strong>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {loading ? (
              <div className="text-center">
                <Loading />
              </div>
            ) : (
              <PdfViewer
                file={policyContent}
                onLoadSuccess={() => {
                  setPolicyLoading(false)
                }}
              />
            )}
            {!isAcknowledged && (
              <div className="mt-3">
                <Button
                  variant="primary"
                  className="btn-block btn-icon"
                  size="lg"
                  onClick={sendAcknowledgement}
                  disabled={sending || policyLoading}
                >
                  {(sending || policyLoading) && (
                    <span className="btn-inner--icon">
                      <FontAwesomeIcon icon={faSpinner} spin />
                    </span>
                  )}
                  <span className="btn-inner--text">Acknowledge policy</span>
                </Button>
              </div>
            )}
          </Main>
        </>
      )}
    </DefaultLayout>
  )
}

export default withAuthenticated(PagePolicyDetails)
