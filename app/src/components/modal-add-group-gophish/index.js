import React, { useCallback } from 'react'
import { Col, Modal, Row, Form, Button } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { toggleGoPhishAddModal, createGroupStaff } from '../../states/staffs'

const { Group: FormGroup, Label, Control: { Feedback }, Control } = Form
const { Header, Title, Body } = Modal
export default function ModalAddGroupGoPhish({ groupValue, resetChecked }) {
  const { submittingStaff } = useSelector(state => state.staffs)
  const showAddModal = useSelector(state => state.staffs.showAddModalGoPhish)
  const dispatch = useDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
  } = useForm()

  /**
   * on closing modal
   * @type {(function(): void)|*}
   */
  const onClose = useCallback(() => {
    dispatch(toggleGoPhishAddModal(false))
  }, [dispatch])

  const onSubmit = useCallback(values => {
    const { groupName } = values
    const createGroup = {
      name: groupName,
      targets: groupValue
    }
    dispatch(createGroupStaff(createGroup))
      .unwrap()
      .then(() => {
        toast.success('New group staff was created!')
        reset()
        resetChecked()
        dispatch(toggleGoPhishAddModal(false))
      })
      .catch(error => {
        toast.error(error.message || 'Could not create new group staff!')
      })
  }, [dispatch, groupValue, reset, resetChecked])


  return (
    <Modal show={showAddModal} onHide={onClose} size="s" centered>
      <Header closeButton>
        <Title>Add Phishing Group</Title>
      </Header>
      <Body>
        <Row>
          <Col lg={12} className="mb-0">
            <Form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              validated={isSubmitted}
            >
              <FormGroup>
                <Label htmlFor="groupName">Group Name</Label>
                <Controller
                  render={({ field }) => (
                    <Control
                      required
                      {...field}
                      isInvalid={!!errors.groupName}
                      placeholder="Enter staff group name"
                    />
                  )}
                  name="groupName"
                  control={control}
                  rules={{
                    required: 'Please enter group name',
                  }}
                />
                {errors && errors.groupName && (
                  <Feedback type="invalid">
                    {errors.groupName.message}
                  </Feedback>
                )}
              </FormGroup>
              <Button
                variant="primary"
                type="submit"
                disabled={submittingStaff}
                className="btn-icon"
              >
                {submittingStaff && (
                  <span className="btn-inner--icon">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  </span>
                )}
                <span className="btn-inner--text">Save changes</span>
              </Button>
            </Form>
          </Col>
        </Row>
      </Body>
    </Modal>
  )
}
