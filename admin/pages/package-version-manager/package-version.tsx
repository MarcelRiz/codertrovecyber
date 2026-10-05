import PackageVersionService from '@src/service/packageVersion.service'
import { useCallback, useEffect, useState } from 'react'
import { Button, Form, InputGroup, ListGroup, Modal } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { PackageVersion } from 'types/package'

type Prop = {
  packageID: string
}

export default function PackageVersionList(prop: Prop) {
  const { packageID } = prop
  const [listPackageVersion, setListPackageVersion] = useState<
    PackageVersion[]
  >([])
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      version: '0.0.0',
      vulnerabilities: [],
    },
  })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleCloseConfirm = () => setShowConfirm(false)
  const handleShowConfirm = () => setShowConfirm(true)
  const [selectedVersion, setSelectedVersion] = useState<PackageVersion>()
  const [listVul, setListVul] = useState<string[]>([])
  const [selectedID, setSelectedID] = useState<string>()

  const handleSelected = (packVer: PackageVersion) => {
    setSelectedVersion(packVer)
    setValue('version', packVer?.version)
    setListVul(
      packVer && packVer.vulnerabilities ? packVer.vulnerabilities : []
    )
  }

  const handleAddVul = () => {
    setListVul([...listVul, ''])
  }

  const getVersions = useCallback(async () => {
    const response = await new PackageVersionService().getVersions(packageID)
    setListPackageVersion(response.data.rows)
  }, [packageID])

  useEffect(() => {
    getVersions()
  }, [packageID])

  const handleVulChange = (event, index) => {
    listVul[index] = event.target.value
    setListVul([...listVul])
  }

  const onSubmit = useCallback(async () => {
    const dto = {
      packageID,
      version: getValues('version'),
      vulnerabilities: listVul,
    }

    if (selectedVersion) {
      const res = await new PackageVersionService().updateVersion(
        selectedVersion.id,
        dto
      )
      if (res) {
        const newListPackageVersion = listPackageVersion.map(packVer => {
          const newPackVer = packVer
          if (newPackVer.id === selectedVersion.id) {
            newPackVer.version = getValues('version')
            newPackVer.vulnerabilities = listVul
          }
          return newPackVer
        })
        setListPackageVersion([...newListPackageVersion])
      }
    } else {
      const res = await new PackageVersionService().createVersion(dto)
      if (res) {
        setListPackageVersion([...listPackageVersion, res.data])
      }
    }
    handleClose()
  }, [getValues, selectedVersion, listVul])

  const handleRemove = useCallback(async (id: string) => {
    const res = new PackageVersionService().removeVersion(id)
    if (res) {
      const newList = listPackageVersion.filter(l => l.id !== selectedID)
      setListPackageVersion([...newList])
    }
  }, [])

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          title="Add Version"
          onClick={() => {
            handleSelected(null)
            setTimeout(() => {
              handleShow()
            }, 500)
          }}
          className="btn btn-sm btn-success"
        >
          <i className="fas fa-plus"></i>
          <span>Add new version</span>
        </button>
      </div>
      <ListGroup>
        {listPackageVersion.map(packVer => (
          <ListGroup.Item>
            <div className="d-flex justify-content-between">
              <span className="text-primary my-auto">
                Version: {packVer.version}
              </span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  title="Edit"
                  onClick={() => {
                    handleSelected(packVer)
                    setTimeout(() => {
                      handleShow()
                    }, 500)
                  }}
                  className="btn btn-sm btn-secondary"
                >
                  <i className="fas fa-pen"></i>
                </button>

                <button
                  type="button"
                  title="Delete"
                  onClick={() => {
                    setSelectedID(packVer.id)
                    handleShowConfirm()
                  }}
                  className="btn btn-sm btn-danger"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <ListGroup>
              {packVer.vulnerabilities &&
                packVer.vulnerabilities.map(vul => (
                  <ListGroup.Item>{vul}</ListGroup.Item>
                ))}
            </ListGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedVersion ? 'Edit Version' : 'Create Version'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            validated={isSubmitted}
          >
            <Form.Group>
              <Form.Label htmlFor="version">Version</Form.Label>
              <InputGroup>
                <Controller
                  render={({ field }) => (
                    <Form.Control type="text" placeholder="Type" {...field} />
                  )}
                  control={control}
                  name="version"
                  rules={{
                    required: true,
                  }}
                />
                {errors && errors.version && (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    Version is required.
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="version">
                <div className="d-flex gap-2">
                  <span className="my-auto">Vulnerabilities</span>
                  <div className="ml-3">
                    <Button variant="primary" size="sm" onClick={handleAddVul}>
                      +
                    </Button>
                  </div>
                </div>
              </Form.Label>
              {listVul.map((vul, index) => (
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Vulnerability ..."
                    value={vul}
                    onChange={event => handleVulChange(event, index)}
                  />
                </InputGroup>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirm} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              handleRemove(selectedID)
              handleCloseConfirm()
            }}
          >
            Yes
          </Button>
          <Button variant="primary" onClick={handleCloseConfirm}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
