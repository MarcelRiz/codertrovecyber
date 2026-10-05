import React, { useEffect, useState, useMemo } from 'react'
import * as Icon from 'react-feather'
import Link from 'next/link'
import Head from 'next/head'
import moment from 'moment'
import { Button, Modal } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import DefaultLayout from '@src/layout/default'
import { Breadcrumb } from '@src/components'
import { useAppDispatch, useAppSelector } from '@src/states/hooks'
import useSortableData from '@src/components/use-hook/use-sortable-data'
import {
  deletedBlog,
  getBlogs,
  selectBlogManagement,
} from '@src/states/features/blogManagementSlice'
import {
  selectUploadFileManagement,
  resetStore,
  removeFile,
} from '@src/states/features/uploadFileManagementSlice'
import styles from './styles.module.scss'

export default function BlogManager() {
  const { blogs } = useAppSelector(selectBlogManagement)
  const dispatch = useAppDispatch()
  const [filterKeys, setFilterKeys] = useState({})
  const [listBlogFilter, setListBlogFilter] = useState([])
  const [listBlog, setListBlog] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [dateSearch, setDateSearch] = useState()
  const { items, requestSort, sortConfig } = useSortableData(blogs, {
    key: 'created_at',
    direction: 'descending',
  })
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [itemPerPage] = useState(10)
  const [currentPage] = useState(1)
  const { isSubmitFile, currentFile } = useAppSelector(
    selectUploadFileManagement
  )

  const getClassNamesFor = name => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  useMemo(() => {
    // componentWillMount events
    if (!isSubmitFile && currentFile.pathName) {
      dispatch(
        removeFile({
          pathName: currentFile.pathName,
        })
      )
    }
    dispatch(resetStore(true))
  }, [resetStore])

  useEffect(() => {
    function getData() {
      dispatch(getBlogs())
    }
    getData()
  }, [dispatch])

  const deleteBlog = value => {
    setSelectedBlog(value)
    setConfirmDelete(true)
  }

  const onDeletedBlog = () => {
    dispatch(deletedBlog(selectedBlog))
    setConfirmDelete(false)
  }

  const filterData = (event, key) => {
    const searchKey = {
      ...filterKeys,
      [key]: event.target.value,
    }
    setFilterKeys(searchKey)
  }

  useEffect(() => {
    function filterByField(data) {
      return Object.entries(filterKeys).every(([key, value]) => {
        if (value === '' || value === null) {
          return true
        }
        if (key === 'created_at') {
          return (
            moment(value).format('DDMMYYYY') ===
            moment(data[key]).format('DDMMYYYY')
          )
        }
        const string = value.toString()
        return data[key]?.toLowerCase().indexOf(string?.toLowerCase()) > -1
      })
    }
    let list = items
    if (Object.keys(filterKeys).length > 0) {
      list = list.filter(item => filterByField(item))
    }
    setListBlogFilter(list)
  }, [items, filterKeys])

  useEffect(() => {
    const pagIndex = currentPage - 1
    setListBlog(
      listBlogFilter.slice(
        pagIndex * itemPerPage,
        pagIndex * itemPerPage + itemPerPage
      )
    )
  }, [listBlogFilter, currentPage])

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - Blog Management</title>
      </Head>
      <DefaultLayout>
        <Breadcrumb>
          <span className="breadcrumb-icon">
            <Icon.List className={styles['navbar-icon']} />
          </span>
          Blog Management
        </Breadcrumb>
        <div className="page-container">
          <div className="row">
            <div className="col-12">
              <div className="card card-fluid d-block justify-content-center mb-0">
                <div className="card-header pb-3">
                  <div className="row align-items-center">
                    <div className="col ml-md-n2">
                      <h5 className="d-block h3 mb-0">Blog List</h5>
                    </div>
                    <div className="col-auto">
                      <div className="text-right">
                        <Link href="/blog-manager/add-blog">
                          <a href="#!" className="btn btn-sm btn-primary mt-2">
                            <Icon.Plus /> Add New Blog
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`card-body ${styles.blogManagement}`}>
                  <div
                    className={`table-responsive pb-3 ${styles.blogManagementTable}`}
                  >
                    <table className="table align-items-center">
                      <thead>
                        <tr>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('title')}
                              className={getClassNamesFor('title')}
                            >
                              Title
                              {getClassNamesFor('title') === 'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('title') === 'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('authorName')}
                              className={getClassNamesFor('authorName')}
                            >
                              Author
                              {getClassNamesFor('authorName') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('authorName') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('categoryName')}
                              className={getClassNamesFor('categoryName')}
                            >
                              Category
                              {getClassNamesFor('categoryName') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('categoryName') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('created_at')}
                              className={getClassNamesFor('created_at')}
                            >
                              Created date
                              {getClassNamesFor('created_at') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('created_at') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col" style={{ minWidth: '200px' }}>
                            Action
                          </th>
                        </tr>

                        <tr>
                          <th>
                            <div className="form-group mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event => filterData(event, 'title')}
                                placeholder={`Search ${blogs?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event =>
                                  filterData(event, 'authorName')
                                }
                                placeholder={`Search ${blogs?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event =>
                                  filterData(event, 'categoryName')
                                }
                                placeholder={`Search ${blogs?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <div className="input-group input-group-merge">
                                <div className="input-group-append date-group">
                                  <DatePicker
                                    selected={dateSearch}
                                    onChange={date => {
                                      setDateSearch(date)
                                      filterData(
                                        { target: { value: date } },
                                        'created_at'
                                      )
                                    }}
                                  />
                                  <span className="input-group-text">
                                    <Icon.Calendar />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th scope="col">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listBlog.map(blog => (
                          <tr key={blog.id}>
                            <th scope="row">
                              <span className="title">{blog.title}</span>
                            </th>
                            <td className="order">
                              <span className="author">{blog.authorName}</span>
                            </td>
                            <td className="order">
                              <span className="category">
                                {blog.categoryName}
                              </span>
                            </td>
                            <td>
                              <span className="taxes text-sm mb-0">
                                {moment(blog.created_at).format('LL')}
                              </span>
                            </td>
                            <td>
                              <div>
                                <Link href={`/blog-manager/${blog.id}`}>
                                  <a
                                    href="#!"
                                    className="btn btn-sm btn-primary px-3"
                                  >
                                    <span
                                      title="View"
                                      className="btn-inner--icon"
                                    >
                                      <i className="far fa-eye"></i>
                                    </span>
                                  </a>
                                </Link>
                                <button
                                  type="button"
                                  title="Delete"
                                  onClick={() => deleteBlog(blog)}
                                  className="btn btn-sm btn-danger btn-icon-only"
                                >
                                  <span className="btn-inner--icon">
                                    <i className="far fa-trash-alt"></i>
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Modal
        show={confirmDelete}
        centered
        onHide={() => setConfirmDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete blog {selectedBlog?.title}?
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger" onClick={onDeletedBlog}>
            Yes
          </Button>
          <Button
            className="btn-sm btn-secondary"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
