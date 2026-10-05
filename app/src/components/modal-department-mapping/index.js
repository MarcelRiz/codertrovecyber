import { Modal } from 'react-bootstrap'
import DepartmentMappingTable from '../form-upload-staffs-csv/department-mapping-table'

export default function ModalDepartmentMapping({ visible, setVisible }) {
  return (
    <Modal
      show={visible}
      onHide={() => {
        setVisible(false)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Department ID Mapping Table</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DepartmentMappingTable />
      </Modal.Body>
    </Modal>
  )
}
