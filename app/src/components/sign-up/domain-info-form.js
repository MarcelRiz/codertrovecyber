import React, { useEffect, useState } from 'react'
import { Form, InputGroup, Button } from 'react-bootstrap'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Plus as IconPlus, Minus as IconMinus } from 'react-feather'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import StorageService from '@src/services/StorageService'
import { URL_REGEX_SECOND } from '@src/constants'
import { useRouter } from 'next/router'
import UserService from '@src/services/UserService'
import UploadService from '@src/services/UploadService'
import { useDispatch } from 'react-redux'
import { setSession } from '@src/states/auth'
import { toast } from 'react-toastify'

const defaultValues = {
  domain: [
    {
      domainField: '',
    },
  ],
}

export default function DomainInfoForm({ prevFormStep, setStepSignUp }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    getValues,
    setValue,
  } = useForm({
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'domain',
  })

  useEffect(() => {
    const states = StorageService.getSignUpInfo()
    const domains = states?.domains?.filter(domain => domain.domainField)
    if (Array.isArray(domains)) {
      domains.forEach((domain, index) => {
        if (index === 0) {
          setValue(`domains[${index}].domainField`, domain?.domainField)
        } else {
          append({ domainField: domain?.domainField })
        }
      })
    }
  }, [])

  const handleRemoveDomain = index => {
    const domains = [...getValues('domains')]
    domains.splice(index, 1)
    remove(index)
    setValue('domains', domains)
  }

  const saveDomains = () => {
    const states = StorageService.getSignUpInfo()
    const domains = getValues('domains').filter(domain => domain?.domainField)
    const payload = {
      ...states,
      domains,
    }
    StorageService.setSignUpInfo(payload)
  }

  const onSubmit = async values => {
    setLoading(true)
    const domains = values.domains.map(domain => domain.domainField)
    const previousStepsData = StorageService.getSignUpInfo()
    const payload = {
      ...previousStepsData,
      domains,
      version: 'full',
      originalPassword: previousStepsData.password,
      departmentId: previousStepsData?.departmentId?.value,
      industry: previousStepsData?.industry?.value,
      checkoutSessionId: router.query?.session_id,
    }
    try {
      const response = await UserService.selfRegister(payload)
      if (response) {
        const companyId = response?.data?.user?.companies[0]?.id
        if (localStorage.file) {
          const extension = localStorage.fileName.split('.')[1]
          fetch(localStorage.file)
            .then(res => res.blob())
            .then(async blob => {
              const file = new File([blob], localStorage.getItem('fileName'), {
                type: `image/${extension}`,
              })
              await UploadService.upload(file, 'company', companyId, 'logo')
              localStorage.removeItem('file')
              localStorage.removeItem('fileName')
            })
        }
        dispatch(setSession(response.data))
        StorageService.clearSignUpInfo()
        StorageService.removeTempLogin()
        UserService.saveSession(response.data, true)
        router.push('/')
      }
    } catch (error) {
      toast.error(error?.message || 'Could not register new client!')
      if (
        error?.message === 'The email is being used, please use another one.'
      ) {
        saveDomains()
        setStepSignUp(0)
      }
    }

    setLoading(false)
  }

  return (
    <Wrapper>
      <p style={{ textAlign: 'center' }}>
        Please provide all your domains and subdomains which you want to get
        vulnerabilities scanned
      </p>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        validated={isSubmitted}
      >
        <Form.Group>
          <InputGroup>
            {fields.map((item, index) => (
              <div key={item.id} className="group-domain">
                <Controller
                  name={`domains[${index}].domainField`}
                  control={control}
                  defaultValue={item.domainField}
                  rules={{
                    required: 'Please enter domain or subdomain',
                    pattern: {
                      value: URL_REGEX_SECOND,
                      message: 'Please enter a valid domain or subdomain',
                    },
                  }}
                  render={({ field }) => (
                    <div className="input-domain">
                      <Form.Control
                        placeholder="https://example.com"
                        {...field}
                        isInvalid={
                          errors.domain &&
                          errors.domain[index] &&
                          !!errors.domain[index].domainField
                        }
                      />
                      <Button
                        variant="light"
                        className="pl-md-3 pr-3 ml-1"
                        disabled={fields.length <= 1}
                        onClick={() => {
                          if (fields.length > 1) {
                            handleRemoveDomain(index)
                          }
                        }}
                      >
                        <IconMinus />
                      </Button>
                      <Button
                        variant="light"
                        className="pl-md-3 pr-3 ml-1"
                        onClick={() => {
                          append({ domainField: '' })
                        }}
                      >
                        <IconPlus />
                      </Button>
                    </div>
                  )}
                />
                {errors &&
                  errors.domain &&
                  errors.domain[index] &&
                  errors.domain[index].domainField && (
                    <Form.Control.Feedback
                      type="invalid"
                      className="d-block error-domain"
                    >
                      {errors.domain[index].domainField
                        ? errors.domain[index].domainField.message
                        : 'Domain is required.'}
                    </Form.Control.Feedback>
                  )}
              </div>
            ))}
          </InputGroup>
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-block btn-primary btn-icon m-0 mt-2"
        >
          {loading && (
            <span className="btn-inner--icon">
              <FontAwesomeIcon icon={faSpinner} spin />
            </span>
          )}
          <span className="btn-inner--text">Get Started</span>
        </Button>{' '}
        <Button
          className="btn btn-block btn-secondary btn-icon m-0 mt-2"
          onClick={() => {
            prevFormStep()
            saveDomains()
          }}
        >
          <span className="btn-inner--text">Back</span>
        </Button>{' '}
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .vul-add-notice {
    &:hover {
      font-weight: bold;
    }
  }

  .group-domain {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0.5em;

    .input-domain {
      display: flex;
      align-items: center;

      .label-domain {
        margin-right: 1em;
        width: 10%;
      }
    }
  }
  .btn-add-domain {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }

  .error-domain {
    margin-left: 10%;
  }
`
