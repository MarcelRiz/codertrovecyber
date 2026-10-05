import React, { useEffect, useState } from 'react'
import * as Icon from 'react-feather'
import Link from 'next/link'
import Head from 'next/head'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Modal } from 'react-bootstrap'

import DefaultLayout from '../../src/layout/default'
import { Breadcrumb } from '../../src/components'
import { useAppDispatch, useAppSelector } from '../../src/states/hooks'
import styles from './styles.module.scss'
import useSortableData from '../../src/components/use-hook/use-sortable-data'
import {
  deletedBlogCategory,
  getBlogCategories,
  selectBlogCategoryManagement,
} from '../../src/states/features/blogCategoryManagementSlice'

export default function UserManager() {
  const { blogCategories } = useAppSelector(selectBlogCategoryManagement)
  const dispatch = useAppDispatch()
  const [filterKeys, setFilterKeys] = useState({})
  const [listCategoryFilter, setListCategoryFilter] = useState([])
  const [listCategory, setListCategory] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { items, requestSort, sortConfig } = useSortableData(blogCategories, {
    key: 'created_at',
    direction: 'descending',
  })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [itemPerPage] = useState(10)
  const [currentPage] = useState(1)

  const getClassNamesFor = name => {
    if (!sortConfig) {
      return ''
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  useEffect(() => {
    function getData() {
      dispatch(getBlogCategories())
    }
    getData()
  }, [dispatch])

  const deleteCategory = value => {
    setSelectedCategory(value)
    setConfirmDelete(true)
  }

  const onDeletedBlogCategory = () => {
    dispatch(deletedBlogCategory(selectedCategory))
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
    setListCategoryFilter(list)
  }, [items, filterKeys])

  useEffect(() => {
    const pagIndex = currentPage - 1
    setListCategory(
      listCategoryFilter.slice(
        pagIndex * itemPerPage,
        pagIndex * itemPerPage + itemPerPage
      )
    )
  }, [listCategoryFilter, currentPage])

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE} - Category Management</title>
      </Head>
      <DefaultLayout>
        <Breadcrumb>
          <span className="breadcrumb-icon">
            <Icon.List className={styles['navbar-icon']} />
          </span>
          Category Management
        </Breadcrumb>
        <div className="page-container">
          <div className="row">
            <div className="col-12">
              <div className="card card-fluid d-block justify-content-center mb-0">
                <div className="card-header pb-3">
                  <div className="row align-items-center">
                    <div className="col ml-md-n2">
                      <h5 className="d-block h3 mb-0">Category List</h5>
                    </div>
                    <div className="col-auto">
                      <div className="text-right">
                        <Link href="/category-manager/add-category">
                          <a href="#!" className="btn btn-sm btn-primary mt-2">
                            <Icon.Plus /> Add New Category
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`card-body ${styles.userManagementList}`}>
                  <div
                    className={`table-responsive pb-3 ${styles.userManagementTable}`}
                  >
                    <table className="table align-items-center">
                      <thead>
                        <tr>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('name')}
                              className={getClassNamesFor('name')}
                            >
                              Name
                              {getClassNamesFor('name') === 'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('name') === 'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col">
                            <span
                              aria-hidden="true"
                              onClick={() => requestSort('description')}
                              className={getClassNamesFor('description')}
                            >
                              Description
                              {getClassNamesFor('description') ===
                                'descending' && (
                                <i className="fas fa-arrow-up ml-2"></i>
                              )}
                              {getClassNamesFor('description') ===
                                'ascending' && (
                                <i className="fas fa-arrow-down ml-2"></i>
                              )}
                            </span>
                          </th>
                          <th scope="col" style={{ minWidth: '100px' }}>
                            Action
                          </th>
                        </tr>
                        <tr>
                          <th>
                            <div className="form-group mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event => filterData(event, 'name')}
                                placeholder={`Search ${blogCategories?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th>
                            <div className="form-group  mb-0">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                onChange={event =>
                                  filterData(event, 'description')
                                }
                                placeholder={`Search ${blogCategories?.length} records...`}
                                autoComplete="off"
                              />
                            </div>
                          </th>
                          <th scope="col">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listCategory.map(category => (
                          <tr key={category.id}>
                            <th scope="row">
                              <span className="client">{category.name}</span>
                            </th>
                            <td className="order">
                              <span className="date">
                                {category.description}
                              </span>
                            </td>
                            <td>
                              <div>
                                <Link href={`/category-manager/${category.id}`}>
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
                                  onClick={() => deleteCategory(category)}
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
          Are you sure you want to delete category {selectedCategory?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-sm btn-danger" onClick={onDeletedBlogCategory}>
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
