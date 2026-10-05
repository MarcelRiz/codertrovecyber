import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import HubspotForm from 'react-hubspot-form'
import { toggleChangeSupportCentreModal } from '../../states/common'
import styles from './styles.module.scss'

export default function ModalChangeSupportCentre() {
  const showSupportCentreModal = useSelector(
    state => state.common.showSupportCentreModal
  )
  const dispatch = useDispatch()

  return (
    <Modal
      show={showSupportCentreModal}
      onHide={() => {
        dispatch(toggleChangeSupportCentreModal(false))
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Support Centre</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <HubspotForm
          region={ process.env.HUBSPOT_REGION || 'na1' }
          portalId={ process.env.HUBSPOT_PORTAL_ID || '20577106' }
          formId={ process.env.HUBSPOT_FORM_ID || '7cb0004e-b06f-4c5a-94bc-7fbbf8ab1ee1' }
          loading={
            <div
              className={styles['support-centre-loading-modal']}
            >
              <Spinner animation="grow" />
              <Spinner animation="grow" />
              <Spinner animation="grow" />
            </div>
          }
        />
      </Modal.Body>
    </Modal>
  )
}
