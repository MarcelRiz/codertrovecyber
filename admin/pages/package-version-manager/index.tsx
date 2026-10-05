/* eslint-disable react/jsx-curly-brace-presence */
import DefaultLayout from '@src/layout/default'
import { deletedPackage, getPackages } from '@src/states/features/packageSlice'
import { useAppDispatch, useAppSelector } from '@src/states/hooks'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Button, Collapse, Modal, Table } from 'react-bootstrap'
import * as Icon from 'react-feather'
import Pagination from 'react-bootstrap/Pagination'
import { Breadcrumb } from '../../src/components'
import styles from './styles.module.scss'
import PackageVersionList from './package-version'

export default function PackageVersionManager() {
  const [page, setPage] = useState<number>(0)
  const [limit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const { packages } = useAppSelector(state => state.packages)
  const [show, setShow] = useState(false)
  const [selectedId, setSelectedId] = useState<string>()
  const [collapseId, setCollapseId] = useState<string>()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const dispatch = useAppDispatch()
  const router = useRouter()

  const findPackages = useCallback(() => {
    dispatch(getPackages({ page, limit }))
      .unwrap()
      .then(res => {
        setTotal(res.data.count)
      })
  }, [page, limit])

  useEffect(() => {
    findPackages()
  }, [page, limit])

  const remove = useCallback((id: string) => {
    dispatch(deletedPackage({ id }))
      .unwrap()
      .then(res => {
        if (res) {
          findPackages()
        }
      })
  }, [])

  return (
    <>
      <Head>
        <title>
          {process.env.NEXT_PUBLIC_TITLE} - Package Version Management
        </title>
      </Head>
      <DefaultLayout>
        <Breadcrumb>
          <span className="breadcrumb-icon">
            <Icon.Package className={styles['navbar-icon']} />
          </span>
          Package Version Management
        </Breadcrumb>
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
            <span className="h3 my-auto">Package List</span>
            <Link href="/package-version-manager/add-package">
              <a href="#!" className="btn btn-sm btn-primary mt-2">
                <Icon.Plus /> Add New Package
              </a>
            </Link>
          </div>
          <div className="card">
            <div className="card-body">
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <td>#</td>
                    <td>name</td>
                    <td>slug</td>
                    <td>type</td>
                    <td>latest version</td>
                    <td>*</td>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pack, index) => (
                    <>
                      <tr key={pack.id}>
                        <td>{index + 1}</td>
                        <td>{pack.name}</td>
                        <td>{pack.slug}</td>
                        <td>{pack.type}</td>
                        <td>{pack.latestVersion}</td>
                        <td className="d-flex gap-2">
                          <button
                            type="button"
                            title={'View Version List'}
                            onClick={() => {
                              if (collapseId === pack.id) {
                                setCollapseId(null)
                              } else {
                                setCollapseId(pack.id)
                              }
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <i className="fas fa-list"></i>
                          </button>
                          <button
                            type="button"
                            title={'Edit'}
                            onClick={() => {
                              router.push(`/package-version-manager/${pack.id}`)
                            }}
                            className="btn btn-sm btn-secondary"
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            type="button"
                            title={'Delete'}
                            onClick={() => {
                              setSelectedId(pack.id)
                              handleShow()
                            }}
                            className="btn btn-sm btn-danger"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                      <tr hidden={pack.id !== collapseId}>
                        <td colSpan={6}>
                          <Collapse in={pack.id === collapseId}>
                            <div>
                              <PackageVersionList
                                packageID={pack.id}
                              ></PackageVersionList>
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-end w-100">
                <Pagination>
                  <Pagination.Prev
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  />

                  <Pagination.Item
                    hidden={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    {page}
                  </Pagination.Item>
                  <Pagination.Item active>{page + 1}</Pagination.Item>
                  <Pagination.Item
                    hidden={total <= (page + 2) * limit}
                    onClick={() => setPage(page + 1)}
                  >
                    {page + 2}
                  </Pagination.Item>

                  <Pagination.Next
                    disabled={total <= (page + 2) * limit}
                    onClick={() => setPage(page + 1)}
                  />
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              remove(selectedId)
              handleClose()
            }}
          >
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
