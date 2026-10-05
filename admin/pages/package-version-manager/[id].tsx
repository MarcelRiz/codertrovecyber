import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import DefaultLayout from '@src/layout/default'
import Head from 'next/head'
import * as Icon from 'react-feather'
import { Controller, useForm } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useAppDispatch } from '@src/states/hooks'
import {
  createPackage,
  getPackage,
  updatePackage,
} from '@src/states/features/packageSlice'
import { Breadcrumb } from '../../src/components'
import styles from './styles.module.scss'

export default function PackageVersionDetail() {
  const router = useRouter()
  const queryParams = router.query
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      name: null,
      slug: null,
      type: null,
      latestVersion: '0.0.0',
    },
  })

  useEffect(() => {
    if (queryParams?.id && queryParams?.id !== 'add-package') {
      dispatch(getPackage({ id: queryParams?.id }))
        .unwrap()
        .then(res => {
          setValue('name', res.data.name)
          setValue('slug', res.data.slug)
          setValue('type', res.data.type)
          setValue('latestVersion', res.data.latestVersion)
        })
    }
  }, [queryParams?.id])

  const onSubmit = useCallback(
    value => {
      if (queryParams?.id && queryParams?.id !== 'add-package') {
        dispatch(updatePackage({ id: queryParams?.id, ...value }))
          .unwrap()
          .then(res => {
            if (res) {
              router.push('/package-version-manager')
            }
          })
      } else {
        dispatch(createPackage(value))
          .unwrap()
          .then(res => {
            if (res) {
              router.push('/package-version-manager')
            }
          })
      }
    },
    [getValues]
  )

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - User Management</title>
      </Head>
      <DefaultLayout>
        <Breadcrumb>
          <span className="breadcrumb-icon">
            <Icon.Package className={styles['navbar-icon']} />
          </span>
          Package Version Management {'>'}{' '}
          {queryParams?.id === 'add-package' ? 'Add' : 'Edit'}
        </Breadcrumb>
        <div className="container-fluid card">
          <Form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            validated={isSubmitted}
          >
            <Form.Group>
              <Form.Label htmlFor="name">Package Name</Form.Label>
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
                    required: true,
                  }}
                />
                {errors && errors.name && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    Name is required.
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="slug">Slug</Form.Label>
              <InputGroup>
                <Controller
                  render={({ field }) => (
                    <Form.Control
                      type="text"
                      placeholder="Slug"
                      {...field}
                      isInvalid={!!errors.slug}
                    />
                  )}
                  control={control}
                  name="slug"
                  rules={{
                    required: true,
                  }}
                />
                {errors && errors.slug && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    Slug is required.
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="type">Type</Form.Label>
              <InputGroup>
                <Controller
                  render={({ field }) => (
                    <Form.Control type="text" placeholder="Type" {...field} />
                  )}
                  control={control}
                  name="type"
                />
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="latestVersion">Latest Version</Form.Label>
              <InputGroup>
                <Controller
                  render={({ field }) => (
                    <Form.Control type="text" placeholder="0.0.0" {...field} />
                  )}
                  control={control}
                  name="latestVersion"
                />
              </InputGroup>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit" className="btn btn-primary">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </DefaultLayout>
    </>
  )
}
