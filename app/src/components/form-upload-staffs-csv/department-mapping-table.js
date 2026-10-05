import React from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

export default function DepartmentMappingTable() {
  const { departments } = useSelector(state => state.auth)

  return (
    <>
      <div className={`table-responsive ${styles['department-table']}`}>
        <table className="table align-items-center">
          <thead>
            <tr>
              <th scope="col" data-width="200">
                <b>Department</b>
              </th>
              <th scope="col" data-width="200">
                <b>Key</b>
              </th>
            </tr>
          </thead>

          <tbody>
            {departments &&
              departments.map(item => (
                <tr key={item.id}>
                  <th>
                    <span>{item?.name || ''}</span>
                  </th>
                  <td>
                    <span>{item?.key || ''}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
