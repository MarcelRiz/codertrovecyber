import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import * as Icon from 'react-feather'
import DefaultLayout from '../../src/layout/default'
import { Breadcrumb, Loading } from '../../src/components'
import { useAppDispatch, useAppSelector } from '../../src/states/hooks'
import {
  selectUserPofile,
  setError,
} from '../../src/states/features/userProfileSlice'
import { createCategory } from '../../src/states/features/blogCategoryManagementSlice'

export default function AddUser() {
  const dispatch = useAppDispatch()
  const { pending, error } = useAppSelector(selectUserPofile)
  const [session] = useSession()
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm()

  const onSubmit = useCallback(values => {
    async function addCategory(params) {
      const response = await dispatch(
        createCategory({
          ...params,
          parents: [session?.id],
        })
      )
      if (response?.payload) {
        router.back()
      }
    }
    dispatch(setError(''))
    addCategory(values)
  }, [])

  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    dispatch(setError(''))
    return () => {
      dispatch(setError(''))
    }
  }, [dispatch])

  return (
    <DefaultLayout>
      {pending && <Loading />}
      <Breadcrumb>
        <span className="breadcrumb-icon">
          <Icon.User />
        </span>
        <Link href="/user-manager">Category Management </Link>/ Add Category
      </Breadcrumb>
      <div className="page-container">
        <div className="row">
          <div className="col-12">
            <div className="card card-fluid justify-content-center">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h1 className="d-block h3 mb-0">Add New Category</h1>
                  </div>
                  <div className="col-auto">
                    <div
                      className="text-right link"
                      onClick={goBack}
                      aria-hidden="true"
                    >
                      <i className="fas fa-chevron-left"></i> Back
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  validated={isSubmitted}
                >
                  <Form.Group>
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <InputGroup>
                      <Controller
                        render={({ field }) => (
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            {...field}
                            isInvalid={!!errors.name}
                          />
                        )}
                        control={control}
                        name="name"
                        rules={{
                          required: 'Title is required.',
                          validate: {
                            compare(value) {
                              return (
                                value.length < 255 ||
                                'Title must be less than 255 characters.'
                              )
                            },
                          },
                        }}
                      />
                      {errors && errors.name && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          {errors.name.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="description">Description</Form.Label>
                    <InputGroup>
                      <Controller
                        render={({ field }) => (
                          <Form.Control
                            type="text"
                            as="textarea"
                            rows={3}
                            placeholder="Description"
                            {...field}
                            isInvalid={!!errors.lastName}
                          />
                        )}
                        control={control}
                        name="description"
                        rules={{
                          validate: {
                            compare(value) {
                              return (
                                value.length < 255 ||
                                'Description must be less than 255 characters.'
                              )
                            },
                          },
                        }}
                      />
                      {errors && errors.description && (
                        <Form.Control.Feedback
                          type="invalid"
                          className="d-block"
                        >
                          {errors.description.message}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>
                  <div className="text-right">
                    <Button type="submit" className="btn  btn-primary">
                      Create New Category
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
