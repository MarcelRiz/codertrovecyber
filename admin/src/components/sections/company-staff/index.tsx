import React, { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import * as Icon from 'react-feather'
import { get } from 'lodash'
import CompanyStaffList from './company-staff-list'
import { useAppDispatch, useAppSelector } from '../../../states/hooks'
import { DownloadFile, IsFileCsv } from '../../../utilities/helps'
import { getStaffUsers, importStaff, selectCompanyStaff } from '../../../states/features/companyStaffSlice'
import { selectUserPofile } from '../../../states/features/userProfileSlice'
import DepartmentMappingTable from './department-mapping-table'

export default function CompanyStaff() {
  const dispatch = useAppDispatch()
  const {loading} = useAppSelector(selectCompanyStaff)
  const {user} = useAppSelector(selectUserPofile)
  const [messageError, setMessageError] = useState('')
  const [fileImport, setFileImport] = useState(null)
  const onChangeFile = (event) => {
    const file = event.target.files[0]
    if (!IsFileCsv(file)) {
      setMessageError('Please select import file with extension .csv')
      return
    }
    setFileImport(file)
    setMessageError('')
  }
  const bulkFile = async (event) => {
    event.preventDefault()
    const res = await dispatch(importStaff({ file: fileImport, userId: user?.id }))
    if(!res?.payload) {
      let resError = null
      resError = res
      setMessageError(resError?.error?.message)
      return
    }
    setFileImport(null)
    dispatch(getStaffUsers({companyId: get(user, 'companies[0].id') }))
  }

  return (
    <>
      <h3>Company Staff</h3>
      <div className="card-body">
        <CompanyStaffList />
        <p className="text-center my-5">
          By default, all users are sent email remiders to complete their training course and policy acknowledgements every 2 weeks until completed.
        </p>

        <h5 className="mb-3">Department ID Mapping</h5>
        <div className="mb-3">
          <DepartmentMappingTable/>
        </div>
        <div className="text-center mb-3">
          You can also upload a list of users, using this department mapping
        </div>

        <Form
          noValidate
        >
          <h5>Add Company Staff in Bulk</h5>
          <Form.Group controlId="formFile" className="mb-3 mt-2">
            <Form.Label htmlFor="file-2[]" className='mb-3'>
              You can also upload a list of users, using
              <span
                onClick={() => DownloadFile('/template/staff_import_template.csv', 'staff_import_template.csv')}  aria-hidden="true"
                className="link p-0 ml-1">
                this template
              </span>
            </Form.Label>

            <div className="d-flex justify-content-start">
              <div className="mt-0 p-2 flex-grow-1">
                {fileImport && (<div className="d-flex items-center">
                  <span >{fileImport.name} </span>
                  <button onClick={() => {setFileImport(null); setMessageError('')}} className="btn btn-default p-0 ml-2 text-danger" type="button" aria-label="Remove"><Icon.X /></button>
                </div>)}
                {!fileImport && (<div>
                  <input type="file" id="file" onChange={onChangeFile} className="custom-input-file" accept=".csv" />
                  <Form.Label htmlFor="file">
                    <Icon.Upload />
                    <span>Choose a file…</span>
                  </Form.Label>
                </div>)}
              </div>

              <div className="text-right p-1">
                <Button type="buttom" className="btn  btn-primary" disabled={loading} onClick={bulkFile}>
                {loading && <Spinner animation="border" size="sm" />}
                  Add Company Staff in Bulk
                </Button>
              </div>
            </div>

            {messageError &&
              (<span className="text-danger">
                {messageError}
              </span>
              )}
          </Form.Group>
        </Form>
      </div>
    </>
  )
}
