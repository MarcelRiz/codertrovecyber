import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import HubspotForm from 'react-hubspot-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-regular-svg-icons'
import { toggleChangeAssistanceRequestModal } from '../../states/common'
import styles from './styles.module.scss'
import { StyledButton } from './buildInComponent.styled'

export default function ModalChangeAssistanceRequest() {
  const showAssistanceRequestModal = useSelector(
    state => state.common.showAssistanceRequestModal
  )
  const dispatch = useDispatch()

  return (
    <>
      <Modal
        show={showAssistanceRequestModal}
        onHide={() => {
          dispatch(toggleChangeAssistanceRequestModal(false))
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cyber Security Assistance Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            If you require immediate Cyber Security assistance, please complete
            and submit the form below and then call us on
            <br />
            (02) 8231 6443.
          </div>
          <div className="mt-3">
            <HubspotForm
              region={process.env.HUBSPOT_REGION || 'na1'}
              portalId={process.env.HUBSPOT_PORTAL_ID || '20577106'}
              formId={
                process.env.ASSISTANCE_HUBSPOT_FORM_ID ||
                '4242388c-0c55-4d6b-928c-4c41337aa490'
              }
              loading={
                <div className={styles['support-centre-loading-modal']}>
                  <Spinner animation="grow" />
                  <Spinner animation="grow" />
                  <Spinner animation="grow" />
                </div>
              }
            />
          </div>
        </Modal.Body>
      </Modal>
      {!showAssistanceRequestModal && (
        <StyledButton
          variant="info"
          className="chat-container"
          onClick={() => dispatch(toggleChangeAssistanceRequestModal(true))}
        >
          <div className="chat-content">
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faComments} size="lg" color="#fff" />
            </span>
            Get urgent Cyber support
          </div>
        </StyledButton>
      )}
    </>
  )
}
