import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@states/hooks'
import {
  getDepartments,
  selectDepartment,
} from '@src/states/features/departmentSlice'
import styles from './styles.module.scss'

export default function DepartmentMappingTable() {
  const { departments } = useAppSelector(selectDepartment)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getDepartments())
  }, [])

  return (
    <>
      <div className={`table-responsive ${styles['department-table']}`}>
        <table className="table align-items-center">
          <thead>
            <tr>
              <th scope="col" data-width="200">
                Department
              </th>
              <th scope="col" data-width="200">
                Key
              </th>
            </tr>
          </thead>

          <tbody>
            {departments &&
              departments.map(item => (
                <tr key={item.id}>
                  <th scope="row">
                    <span className="client">{item?.name || ''}</span>
                  </th>
                  <td className="order">
                    <span className="date">{item?.key || ''}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
