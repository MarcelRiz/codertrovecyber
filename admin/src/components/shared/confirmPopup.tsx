import React from 'react'
import { Button, OverlayTrigger,Popover } from 'react-bootstrap'

const { Title: TitlePopover, Content: ContentPopover } = Popover
export default function ConfirmPopup({ id, title, showPopup, onOk, onCancel, childrenComponent }) {
  return (
    <OverlayTrigger
      show={showPopup}
      trigger="click"
      placement="top"
      overlay={
        <Popover id={`popover-basic-${id}`}>
          <TitlePopover as="h3">
            {title}
          </TitlePopover>
          <ContentPopover className="d-flex justify-content-center">
            <Button variant="success" onClick={() => onOk(id)}>Ok</Button>
            <Button variant="secondary" onClick={() => onCancel(id)}>Cancel</Button>
          </ContentPopover>
        </Popover>
      }
    >
      {childrenComponent}
    </OverlayTrigger>
  )
}
