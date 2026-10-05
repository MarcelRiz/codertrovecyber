import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form } from 'react-bootstrap'
import Link from 'next/link'
import * as Icon from 'react-feather'
import styled from 'styled-components'
import { Select } from 'antd'

import DefaultLayout from '@src/layout/default'
import { Breadcrumb, Loading } from '@src/components'
import { useAppDispatch, useAppSelector } from '@src/states/hooks'
import {
  selectBlogManagement,
  setError,
  updateBlog,
  getBlog,
} from '@src/states/features/blogManagementSlice'
import {
  getBlogCategories,
  selectBlogCategoryManagement,
} from '@src/states/features/blogCategoryManagementSlice'
import { setIsSubmitFile } from '@src/states/features/uploadFileManagementSlice'
import { UploadInput, CustomCkeditor5 } from '@src/components/shared'
import styles from './styles.module.scss'

const { Option } = Select
export default function AddBlog() {
  const dispatch = useAppDispatch()
  const { pending, error, editingBlog } = useAppSelector(selectBlogManagement)
  const { blogCategories } = useAppSelector(selectBlogCategoryManagement)
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    setValue,
    clearErrors,
    reset,
  } = useForm()

  useEffect(() => {
    dispatch(getBlogCategories())
    dispatch(getBlog({ id: router.query?.id }))
  }, [router.query])

  useEffect(() => {
    reset({
      title: editingBlog?.title || '',
      categoryId: editingBlog?.categoryId || '',
      thumbnailImage: editingBlog?.thumbnailImage || '',
      description: editingBlog?.description || '',
      content: editingBlog?.content || '',
    })
  }, [editingBlog])

  const onSubmit = useCallback(
    async values => {
      const response = await dispatch(
        updateBlog({
          id: router.query.id,
          ...values,
        })
      )
      if (response?.payload) {
        router.back()
      }
      dispatch(setError(''))
      dispatch(setIsSubmitFile(true))
    },
    [router.query.id]
  )

  const goBack = () => {
    router.back()
  }

  useEffect(() => {
    dispatch(setError(''))
    return () => {
      dispatch(setError(''))
    }
  }, [dispatch])

  const selectedCategory = useCallback(
    selectVal => {
      if (selectVal && selectVal.id) {
        return selectVal.id
      }
      return selectVal
    },
    [blogCategories]
  )

  return (
    <DefaultLayout>
      {pending && <Loading />}
      <Breadcrumb>
        <span className="breadcrumb-icon">
          <Icon.User />
        </span>
        <Link href="/blog-manager">Blog Management </Link>/ Update Blog
      </Breadcrumb>
      <div className="page-container">
        <div className="row">
          <div className="col-12">
            <div className="card card-fluid justify-content-center">
              <div className="card-header pb-3">
                <div className="row align-items-center">
                  <div className="col ml-md-n2">
                    <h1 className="d-block h3 mb-0">Update Blog</h1>
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
                    <Form.Label htmlFor="title">Title</Form.Label>
                    <Controller
                      render={({ field }) => (
                        <Form.Control
                          type="text"
                          placeholder="Title"
                          {...field}
                          isInvalid={!!errors.title}
                        />
                      )}
                      control={control}
                      name="title"
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
                    {errors && errors.title && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.title.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="categoryId">Category</Form.Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field }) => (
                        <StyledSelect
                          isError={errors.categoryId && true}
                          className={styles.categorySelect}
                          showSearch
                          size="large"
                          placeholder="Select category"
                          optionFilterProp="children"
                          allowClear
                          {...field}
                          value={selectedCategory(field.value)}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          filterSort={(optionA, optionB) =>
                            optionA.children
                              .toLowerCase()
                              .localeCompare(optionB.children.toLowerCase())
                          }
                        >
                          {blogCategories.length > 0 &&
                            blogCategories.map(category => (
                              <Option key={category.id} value={category.id}>
                                {category.name}
                              </Option>
                            ))}
                        </StyledSelect>
                      )}
                    />
                    {errors && errors.categoryId && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        Category is required.
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label htmlFor="thumbnailImage">
                      Thumbnail Image
                    </Form.Label>
                    <Controller
                      render={({ field }) => (
                        <UploadInput
                          type="image"
                          {...field}
                          data={field.value}
                          onDone={cb => {
                            setValue('thumbnailImage', {
                              ...cb,
                            })
                            clearErrors('thumbnailImage')
                          }}
                          isError={errors.thumbnailImage && true}
                        />
                      )}
                      control={control}
                      name="thumbnailImage"
                      rules={{
                        required: true,
                      }}
                    />
                    {errors && errors.thumbnailImage && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        Thumbnail image is required.
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="description">Description</Form.Label>
                    <Controller
                      render={({ field }) => (
                        <Form.Control
                          type="text"
                          as="textarea"
                          rows={2}
                          placeholder="Description"
                          {...field}
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
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.description.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label htmlFor="content">Content</Form.Label>
                    <Controller
                      render={({ field }) => (
                        <CustomCkeditor5
                          // data={field.value || ''}
                          data={editingBlog?.content || ''}
                          {...field}
                          onDone={val => {
                            setValue('content', val)
                          }}
                          isError={errors.content && 'Content is required.'}
                        />
                      )}
                      control={control}
                      name="content"
                      rules={{
                        required: true,
                      }}
                    />
                  </Form.Group>

                  <div className="text-right">
                    <Button type="submit" className="btn btn-primary">
                      Update Blog
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

const StyledSelect = styled(Select)`
  .ant-select-selector {
    border: ${props => props.isError && '1px solid #f54d63 !important'};
    height: 5vh !important;
    display: flex;
    align-items: center;
    border-radius: ${props =>
      props.isError
        ? '0.375rem 0 0 0.375rem !important'
        : '0.375rem !important'};
    padding: 0 1.4em !important;
    :hover {
      border-color: ${props => !props.isError && 'blueviolet !important'};
    }
    :focus-within {
      border-color: rgba(70, 21, 214, 0.5) !important;
      box-shadow: 0 0 2px 2px rgba(69, 21, 214, 0.26) !important;
    }
  }
`
