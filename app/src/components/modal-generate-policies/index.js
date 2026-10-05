/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  closeGenerateModal,
  generatePolicies,
  getAllPolicies,
  getPolicyTemplates,
} from '../../states/policies'
import PoliciesService from '../../services/PoliciesService'
import PdfViewer from '../pdf-viewer'

export default function ModalGeneratePolicies() {
  const { showGenerate, templates, generatingPolicies } = useSelector(
    state => state.policies
  )
  const { user } = useSelector(state => state.auth?.session)
  const [policyContent, setPolicyContent] = useState('')

  const dispatch = useDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
    setValue,
    watch,
  } = useForm()

  const watchPolicies = watch('policies')

  // const templatesNameHash = useMemo(
  //   () =>
  //     templates.reduce((acc, cur) => {
  //       acc[cur.id] = cur.name
  //       return acc
  //     }, []),
  //   [templates]
  // )

  /**
   * on submitting info
   * @type {(function(*): void)|*}
   */
  const onSubmit = useCallback(
    values => {
      const { policies, owner } = values
      const templateIds = policies.filter(item => !!item)

      if (!templateIds.length) {
        toast.warn('Please select at least one policy to generate!')
        return
      }

      dispatch(
        generatePolicies({
          policiesTemplateIds: templateIds,
          owner,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(closeGenerateModal())
          dispatch(getAllPolicies())
          toast.success('Generate policies successfully!')
        })
        .catch(() => {
          toast.warn('Could not generate policies')
        })
    },
    [dispatch]
  )

  /**
   * on close modal
   * @type {(function(): void)|*}
   */
  const closeModal = useCallback(() => {
    dispatch(closeGenerateModal())
  }, [dispatch])

  /**
   * get all policy templates
   * @type {(function(): void)|*}
   */
  const getTemplates = useCallback(() => {
    dispatch(getPolicyTemplates())
  }, [dispatch])

  // /**
  //  * preview policy template
  //  */
  // const previewPolicyTemplate = useCallback(
  //   async values => {
  //     const { policies, owner } = values
  //     const templateIds = policies.filter(item => !!item)
  //     if (!templateIds.length) {
  //       toast.warn('Please select at least one policy to preview!')
  //     } else if (templateIds.length === 1) {
  //       PoliciesService.previewPolicy(
  //         user?.companies[0]?.id,
  //         templateIds[0],
  //         owner
  //       )
  //         .then(pdf => {
  //           download(pdf, templatesNameHash[templateIds[0]])
  //           dispatch(closeGenerateModal())
  //         })
  //         .catch(() => {
  //           toast.warn('Could not preview policy')
  //         })
  //     } else {
  //       const promises = templateIds.map(async templateId => {
  //         const url = await PoliciesService.previewPolicy(
  //           user?.companies[0]?.id,
  //           templateId,
  //           owner
  //         )
  //         const t = await fetch(url)
  //         const b = await t.blob()
  //         return new Promise((resolve, reject) => {
  //           const reader = new FileReader()
  //           reader.onload = () => {
  //             resolve(reader.result)
  //           }
  //           reader.onerror = error => {
  //             reject(error)
  //           }
  //           reader.readAsBinaryString(b)
  //         })
  //       })
  //       Promise.all(promises)
  //         .then(pdfs => {
  //           toast.info('Compressing, please wait...')
  //           const zip = new JSzip()
  //           pdfs.forEach((pdf, index) => {
  //             const templateId = templateIds[index]
  //             zip.file(`${templatesNameHash[templateId]}.pdf`, pdf, {
  //               binary: true,
  //             })
  //           })
  //           zip.generateAsync({ type: 'blob' }).then(content => {
  //             downloadBlob(content, 'company-policies_preview.zip')
  //           })
  //           dispatch(closeGenerateModal())
  //         })
  //         .catch(() => {
  //           toast.warn('Could not preview policy')
  //         })
  //     }
  //   },
  //   [dispatch, templatesNameHash, user?.companies]
  // )

  /**
   * select all policy templates
   * @type {(function(): void)|*}
   */
  const selectAllPolicies = useCallback(() => {
    templates.forEach((item, index) => setValue(`policies.[${index}]`, item.id))
  }, [setValue, templates])

  const unSelectAllPolicies = useCallback(() => {
    templates.forEach((item, index) => setValue(`policies.[${index}]`, 0))
  }, [setValue, templates])

  /**
   * on opening get all templates
   */
  useEffect(() => {
    if (showGenerate) {
      getTemplates()
    }
  }, [showGenerate, getTemplates])

  useEffect(() => {
    if (showGenerate) {
      reset({
        policies: [],
        owner: '',
      })
    }
  }, [reset, showGenerate])

  const handlePreviewPolicy = useCallback(
    item => async () => {
      try {
        const response = await PoliciesService.previewPolicy(
          user?.companies[0]?.id,
          item.id
        )
        setPolicyContent(response)
      } catch (error) {
        console.error({ error })
      }
    },
    []
  )

  return (
    <Modal size="xl" show={showGenerate} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Generate Cybersecurity Policies</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={isSubmitted}>
          <Row>
            <Col lg={5}>
              <h5>
                <div className="d-inline-flex mr-2" style={{ width: 20 }}>
                  <FontAwesomeIcon icon={faFile} className="mr-2" fixedWidth />
                </div>
                Select policies to generate
              </h5>
              <Button
                variant="primary"
                size="sm"
                className="mb-3"
                onClick={selectAllPolicies}
                style={{
                  marginRight: '0.5rem',
                }}
              >
                Select all policies
              </Button>
              <Button
                variant="neutral"
                size="sm"
                className="mb-3"
                style={{
                  marginLeft: 0,
                }}
                onClick={unSelectAllPolicies}
              >
                Unselect all selected policies
              </Button>
              <Form.Group>
                {templates.map((item, index) => (
                  <Controller
                    key={item}
                    render={({ field }) => (
                      <div className="d-flex align-items-center">
                        <Form.Check
                          id={`policies-${index}`}
                          custom
                          type="checkbox"
                          label={item.name}
                          checked={watchPolicies && watchPolicies[index]}
                          onChange={e =>
                            field.onChange(e.target.checked ? item.id : null)
                          }
                        />
                        <a
                          className="ml-3"
                          href="#"
                          onClick={handlePreviewPolicy(item)}
                        >
                          {' '}
                          Preview{' '}
                        </a>
                      </div>
                    )}
                    name={`policies.[${index}]`}
                    control={control}
                  />
                ))}
              </Form.Group>
            </Col>
            <Col lg={7}>
              {policyContent && (
                <PdfViewer file={policyContent} onLoadSuccess={() => {}} />
              )}
            </Col>
          </Row>
          <h5>
            <div className="d-inline-flex mr-2" style={{ width: 20 }}>
              <FontAwesomeIcon icon={faUser} className="mr-2" fixedWidth />
            </div>
            Policy Owner
          </h5>
          <Form.Group>
            <Controller
              render={({ field }) => (
                <Form.Control
                  isInvalid={!!errors.owner}
                  {...field}
                  required
                  placeholder="Enter owner of these policies"
                />
              )}
              name="owner"
              control={control}
              rules={{
                required: 'Please enter owner name',
              }}
            />
            {errors && errors.owner && (
              <Form.Control.Feedback type="invalid">
                {errors.owner.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <div className="text-center">
            <Button
              variant="primary"
              className="btn-icon"
              disabled={generatingPolicies}
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              {generatingPolicies && (
                <span className="btn-inner--icon">
                  <FontAwesomeIcon icon={faSpinner} spin />
                </span>
              )}
              <span className="btn-inner--text">Generate policies</span>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
