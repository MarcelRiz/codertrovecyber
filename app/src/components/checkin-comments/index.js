import React, { useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronLeft,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'

export default function CheckinComments() {
  const [show, setShow] = useState(false)
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm()

  const onSubmit = useCallback(() => {}, [])

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        className="d-flex align-items-center justify-content-between"
        onClick={() => {
          setShow(!show)
        }}
      >
        <h5>Comments (2)</h5>
        <div>
          <FontAwesomeIcon
            icon={show ? faChevronDown : faChevronLeft}
            className="mr-2"
          />
          {show ? 'Hide' : 'Show'} comments
        </div>
      </div>
      {show && (
        <div>
          <Card className="mb-2">
            <Card.Body>
              <Card.Title as="div">Admin - January 01, 2021 20:00</Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                iaculis elit ultrices, eleifend massa sit amet, faucibus magna.
                Ut pharetra lorem vel leo elementum, id pulvinar metus tempus.
                Nulla facilisi. Cras a faucibus justo. Ut posuere rutrum turpis,
                quis commodo augue sodales eget. Quisque fringilla dignissim
                nisi a vulputate. Etiam non neque in lectus facilisis faucibus.
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-2 text-right" bg="primary">
            <Card.Body>
              <Card.Title as="div" className="text-white">
                You - January 01, 2021 20:00
              </Card.Title>
              <Card.Text className="text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                iaculis elit ultrices, eleifend massa sit amet, faucibus magna.
                Ut pharetra lorem vel leo elementum, id pulvinar metus tempus.
                Nulla facilisi. Cras a faucibus justo. Ut posuere rutrum turpis,
                quis commodo augue sodales eget. Quisque fringilla dignissim
                nisi a vulputate. Etiam non neque in lectus facilisis faucibus.
              </Card.Text>
            </Card.Body>
          </Card>

          <Form
            noValidate
            validated={isSubmitted}
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <FormControl
                    as="textarea"
                    {...field}
                    required
                    isInvalid={!!errors.comment}
                    placeholder="Enter your comment here"
                  />
                )}
                name="comment"
                control={control}
                rules={{ required: 'Please enter comment' }}
              />
              <Button size="lg">
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
              {errors && errors.comment && (
                <Form.Control.Feedback type="invalid">
                  {errors.comment.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form>
        </div>
      )}
    </div>
  )
}
