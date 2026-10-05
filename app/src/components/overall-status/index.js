import React, { useCallback, useEffect, memo } from 'react'
import {
  Button,
  Card,
  Col,
  Row,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { PieChart as IconPercent } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactCardFlip from 'react-card-flip'
import { faExchangeAlt, faEye } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { getCompanySummary, getUserSummary } from '../../states/auth'
import { USER_ROLE } from '../../constants'

const YourAwareness = dynamic(() => import('../your-awareness'), { ssr: false })
const YourPolicyStatus = dynamic(() => import('../your-policy-status'), {
  ssr: false,
})
const YourPendingActionItems = dynamic(
  () => import('../your-pending-action-items'),
  { ssr: false }
)
const OverallPolicyStatus = dynamic(() => import('../overall-policy-status'), {
  ssr: false,
})
const OverallStaffAwareness = dynamic(
  () => import('../overall-staff-awareness'),
  { ssr: false }
)

function OverallStatus({ isFlipped, onOverallStatusChange }) {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.auth?.session?.user)
  const router = useRouter()
  /**
   * get company summary
   * @type {(function(): void)|*}
   */
  const getSummary = useCallback(() => {
    dispatch(getCompanySummary())
  }, [dispatch])

  /**
   * on load get company summary
   */
  useEffect(() => {
    getSummary()
  }, [getSummary])

  /**
   * get personal summary
   * @type {(function(): void)|*}
   */
  const getPersonalSummary = useCallback(() => {
    dispatch(getUserSummary())
  }, [dispatch])

  useEffect(() => {
    getPersonalSummary()
  }, [getPersonalSummary])

  const changeView = useCallback(() => {
    onOverallStatusChange()
  }, [])

  const Face = ({ children, isOverall, zIndex }) => (
    <Card style={{ minHeight: '100%', zIndex }}>
      <Card.Body className="d-lg-flex flex-lg-column justify-content-center">
        <div className="text-center mb-3">
          <IconPercent size={32} />
        </div>
        <h3 className="text-center">{isOverall ? 'Overall' : 'My'} Status</h3>
        <Row className="mx-n2">{children}</Row>
        <div className="text-center mt-5 d-flex justify-content-center">
          {user.role.name === USER_ROLE.CLIENT && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Individual Stats</Tooltip>}
            >
              <Button
                variant="neutral"
                className="rounded-pill btn-icon btn-icon-only mr-5"
                onClick={() => router.push('/overall-status')}
              >
                <span className="btn-inner--icon">
                  <FontAwesomeIcon icon={faEye} />
                </span>
              </Button>
            </OverlayTrigger>
          )}

          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip>{isFlipped ? 'Overall Status' : 'My Status'}</Tooltip>
            }
          >
            <Button
              variant="neutral"
              className="rounded-pill btn-icon btn-icon-only"
              onClick={changeView}
            >
              <span className="btn-inner--icon">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </span>
            </Button>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  )

  const FaceFront = () => (
    <Face isOverall zIndex={isFlipped ? '0' : '2'}>
      <Col lg={4} className="px-2">
        <OverallStaffAwareness />
      </Col>
      <Col lg={4} className="px-2">
        <OverallPolicyStatus />
      </Col>
      <Col lg={4} className="px-2">
        <YourPendingActionItems />
      </Col>
    </Face>
  )

  const FaceBack = () => (
    <Face isOverall={false} zIndex={isFlipped ? '2' : '0'}>
      <Col lg={{ span: 4, offset: 1 }} className="px-2">
        <YourAwareness />
      </Col>
      <Col lg={{ span: 4, offset: 2 }} className="px-2">
        <YourPolicyStatus />
      </Col>
    </Face>
  )

  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      containerStyle={{
        minHeight: 'calc(100% - 30px)',
        height: 'calc(100% - 30px)',
      }}
    >
      <FaceFront />
      <FaceBack />
    </ReactCardFlip>
  )
}

const MemmoizedOverallStatus = memo(OverallStatus)
export default MemmoizedOverallStatus
