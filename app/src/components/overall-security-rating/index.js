import React, { useCallback, useState } from 'react'
import {
  Card,
  OverlayTrigger,
  ProgressBar,
  Tooltip,
  Modal,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

export default function OverallSecurityRating() {
  const user = useSelector(state => state.auth?.session?.user)
  const securityRating = user?.securityRating
  const company = user?.companies[0]
  const [isShowStandard, setIsShowStandard] = useState(false)

  /**
   * check value is not null or undefined
   * @type {function(*): boolean}
   */
  const isNotNullOrUndefined = useCallback(
    value => value !== null && value !== undefined,
    []
  )

  return (
    <Card className={styles.card}>
      <Card.Body>
        <h3 className="text-left">Your Threat Rating</h3>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              Your industry's average security rating, based on people, process
              and technology
            </Tooltip>
          }
        >
          <h5 id="industry_benchmarking" className="d-block h5 mt-3">
            Industry Benchmarking
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="warning"
              min={0}
              max={100}
              now={parseFloat(company?.industry?.rating || 0)}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-warning">
              {company?.industry?.rating ? (
                <>{Math.round(parseFloat(company?.industry?.rating || 0))}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              Your company's current security rating, based on people, process
              and technology
            </Tooltip>
          }
        >
          <h5 id="company_rating" className="d-block h5 mt-3">
            Company Rating
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="danger"
              min={0}
              max={100}
              now={securityRating?.company}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-danger">
              {isNotNullOrUndefined(securityRating?.company) ? (
                <>{Math.round(securityRating?.company)}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>Your company’s overall staff security rating</Tooltip>
          }
        >
          <h5 id="people_rating" className="d-block h5 mt-3">
            People Rating
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="info"
              min={0}
              max={100}
              now={securityRating?.people}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-info">
              {isNotNullOrUndefined(securityRating?.people) ? (
                <>{Math.round(securityRating?.people)}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>Your company’s overall process security rating</Tooltip>
          }
        >
          <h5 id="process_rating" className="d-block h5 mt-3">
            Process Rating
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="info"
              min={0}
              max={100}
              now={securityRating?.process}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-info">
              {isNotNullOrUndefined(securityRating?.process) ? (
                <>{Math.round(securityRating?.process)}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>Your company’s overall technology security rating</Tooltip>
          }
        >
          <h5 id="technology_rating" className="d-block h5 mt-3">
            Technology Rating
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="info"
              min={0}
              max={100}
              now={securityRating?.technology}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-info">
              {isNotNullOrUndefined(securityRating?.technology) ? (
                <>{Math.round(securityRating?.technology)}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>Your company’s CIS, NIST & ISO Essentials Rating</Tooltip>
          }
        >
          <h5 id="cis_rating" className="d-block h5 mt-3">
            CIS, NIST & ISO Essentials Rating
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => setIsShowStandard(true)}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
            </a>
          </h5>
        </OverlayTrigger>
        <div className="d-flex align-items-center">
          <div className="w-80">
            <ProgressBar
              className="progress-sm shadow-none"
              variant="info"
              min={0}
              max={100}
              now={securityRating?.standard}
            />
          </div>
          <div className="col px-0 text-right">
            <h6 className="h6 text-sm text-info">
              {isNotNullOrUndefined(securityRating?.standard) ? (
                <>{Math.round(securityRating?.standard)}%</>
              ) : (
                <>N/A</>
              )}
            </h6>
          </div>
        </div>

        <Modal show={isShowStandard} onHide={() => setIsShowStandard(false)}>
          <Modal.Header closeButton>
            <Modal.Title>CIS, NIST & ISO Essentials Rating</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>NIST Essentials</h3>
            <p>
              The NIST Framework is voluntary guidance, based on existing
              standards, guidelines, and practices for organizations to better
              manage and reduce cybersecurity risk. In addition to helping
              organizations manage and reduce risks, it was designed to foster
              risk and cybersecurity management communications amongst both
              internal and external organizational stakeholders.
            </p>
            <h3>CIS Essentials</h3>
            <p>
              The CIS Controls are a prioritized set of Safeguards to mitigate
              the most prevalent cyber-attacks against systems and networks.
              They are mapped to and referenced by multiple legal, regulatory,
              and policy frameworks. CIS Controls v8 has been enhanced to keep
              up with modern systems and software.
            </p>
            <h3>ISO Essentials</h3>
            <p>
              ISO/IEC 27001 is widely known, providing requirements for an
              information security management system (ISMS), using these
              standards enables organizations of any kind to manage the security
              of assets such as financial information, intellectual property,
              employee details or information entrusted by third parties.
            </p>
          </Modal.Body>
        </Modal>
      </Card.Body>
    </Card>
  )
}
